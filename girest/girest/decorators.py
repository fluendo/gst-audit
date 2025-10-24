"""
Custom decorators for GIRest that handle complex schemas with allOf, anyOf, oneOf.

These decorators extend Connexion's decorators to properly handle schemas without
a direct "type" field, which is common when using JSON Schema composition keywords.
"""

import logging
import typing as t
import functools
import asyncio

from connexion.decorators.parameter import (
    AsyncParameterDecorator,
    prep_kwargs,
    unwrap_decorators,
)
from connexion.decorators.main import ASGIDecorator
from connexion.decorators.response import AsyncResponseDecorator
from connexion.frameworks.starlette import Starlette as StarletteFramework
from connexion.lifecycle import ConnexionRequest
from connexion.operations import AbstractOperation
from connexion.utils import inspect_function_arguments, is_null, is_nullable, make_type

logger = logging.getLogger("girest.decorators")


def _get_val_from_param_girest(value: t.Any, param_definitions: t.Dict[str, dict]) -> t.Any:
    """
    Cast a value according to its definition in the specification.
    
    This version handles complex schemas with allOf, anyOf, oneOf that don't have
    a direct "type" field. For such schemas, the value has already been parsed by
    our custom URI parser, so we just return it as-is.
    """
    param_schema = param_definitions.get("schema", param_definitions)

    if is_nullable(param_schema) and is_null(value):
        return None

    # Check if schema has a direct "type" field
    if "type" in param_schema:
        if param_schema["type"] == "array":
            type_ = param_schema["items"]["type"]
            format_ = param_schema["items"].get("format")
            return [make_type(part, type_, format_) for part in value]
        else:
            type_ = param_schema["type"]
            format_ = param_schema.get("format")
            return make_type(value, type_, format_)
    
    # For complex schemas (allOf, anyOf, oneOf) or schemas with $ref,
    # the value has already been parsed by our custom URI parser
    # Just return it as-is
    logger.debug(f"Returning pre-parsed value for complex schema: {value}")
    return value


def _get_path_arguments_girest(
    path_params: dict, *, operation: AbstractOperation, sanitize: t.Callable
) -> dict:
    """
    Extract handler function arguments from path parameters.
    
    Uses our custom _get_val_from_param_girest to handle complex schemas.
    """
    kwargs = {}

    path_definitions = {
        parameter["name"]: parameter
        for parameter in operation.parameters
        if parameter["in"] == "path"
    }

    for name, value in path_params.items():
        sanitized_key = sanitize(name)
        if name in path_definitions:
            kwargs[sanitized_key] = _get_val_from_param_girest(value, path_definitions[name])
        else:  # Assume path params mechanism used for injection
            kwargs[sanitized_key] = value
    return kwargs


def _get_query_arguments_girest(
    query_params: dict,
    *,
    operation: AbstractOperation,
    arguments: t.List[str],
    has_kwargs: bool,
    sanitize: t.Callable,
) -> dict:
    """
    Extract handler function arguments from the query parameters.
    
    Uses our custom _get_val_from_param_girest to handle complex schemas.
    """
    query_definitions = {
        parameter["name"]: parameter
        for parameter in operation.parameters
        if parameter["in"] == "query"
    }

    kwargs = {}
    for name, value in query_params.items():
        sanitized_key = sanitize(name)
        if name in query_definitions:
            kwargs[sanitized_key] = _get_val_from_param_girest(value, query_definitions[name])
        elif has_kwargs:
            kwargs[sanitized_key] = value

    return kwargs


def get_arguments_girest(
    operation: AbstractOperation,
    *,
    path_params: dict,
    query_params: dict,
    body: t.Any,
    files: dict,
    arguments: t.List[str],
    has_kwargs: bool,
    sanitize: t.Callable,
    content_type: str,
) -> t.Dict[str, t.Any]:
    """
    Get arguments for handler function using our custom parameter extraction.
    
    This version uses our custom _get_path_arguments_girest and _get_query_arguments_girest
    to properly handle complex schemas.
    """
    from connexion.decorators.parameter import _get_body_argument, _get_file_arguments
    
    ret = {}
    ret.update(_get_path_arguments_girest(path_params, operation=operation, sanitize=sanitize))
    ret.update(
        _get_query_arguments_girest(
            query_params,
            operation=operation,
            arguments=arguments,
            has_kwargs=has_kwargs,
            sanitize=sanitize,
        )
    )

    if operation.method.upper() == "TRACE":
        # TRACE requests MUST NOT include a body (RFC7231 section 4.3.8)
        return ret

    ret.update(
        _get_body_argument(
            body,
            operation=operation,
            arguments=arguments,
            has_kwargs=has_kwargs,
            sanitize=sanitize,
            content_type=content_type,
        )
    )
    body_schema = operation.body_schema(content_type)
    ret.update(_get_file_arguments(files, arguments, body_schema, has_kwargs))
    return ret


def prep_kwargs_girest(
    request: ConnexionRequest,
    *,
    request_body: t.Any,
    files: t.Dict[str, t.Any],
    arguments: t.List[str],
    has_kwargs: bool,
    sanitize: t.Callable,
) -> dict:
    """
    Prepare kwargs for the handler function using our custom get_arguments_girest.
    """
    from connexion.context import context, operation
    from connexion.decorators.parameter import CONTEXT_NAME
    
    kwargs = get_arguments_girest(
        operation,
        path_params=request.path_params,
        query_params=request.query_params,
        body=request_body,
        files=files,
        arguments=arguments,
        has_kwargs=has_kwargs,
        sanitize=sanitize,
        content_type=request.mimetype,
    )

    # optionally convert parameter variable names to un-shadowed, snake_case form
    kwargs = {sanitize(k): v for k, v in kwargs.items()}

    # add context info (e.g. from security decorator)
    for key, value in context.items():
        if has_kwargs or key in arguments:
            kwargs[key] = value
        else:
            logger.debug("Context parameter '%s' not in function arguments", key)
    # attempt to provide the request context to the function
    if CONTEXT_NAME in arguments:
        kwargs[CONTEXT_NAME] = context

    return kwargs


class GIRestAsyncParameterDecorator(AsyncParameterDecorator):
    """
    Custom async parameter decorator for GIRest that handles complex schemas.
    
    This decorator uses our custom prep_kwargs_girest which properly handles
    schemas with allOf, anyOf, oneOf that don't have a direct "type" field.
    """
    
    def __call__(self, function: t.Callable) -> t.Callable:
        unwrapped_function = unwrap_decorators(function)
        arguments, has_kwargs = inspect_function_arguments(unwrapped_function)

        @functools.wraps(function)
        async def wrapper(request: ConnexionRequest) -> t.Any:
            request_body = self._maybe_get_body(
                request, arguments=arguments, has_kwargs=has_kwargs
            )

            while asyncio.iscoroutine(request_body):
                request_body = await request_body

            # Use our custom prep_kwargs_girest instead of the standard one
            kwargs = prep_kwargs_girest(
                request,
                request_body=request_body,
                files=await request.files(),
                arguments=arguments,
                has_kwargs=has_kwargs,
                sanitize=self.sanitize_fn,
            )

            return await function(**kwargs)

        return wrapper


class GIRestStarletteDecorator(ASGIDecorator):
    """
    Custom Starlette decorator for GIRest that uses our custom parameter decorator.
    
    This decorator uses GIRestAsyncParameterDecorator instead of the standard
    AsyncParameterDecorator to properly handle complex schemas.
    """
    
    framework = StarletteFramework

    @property
    def _parameter_decorator_cls(self) -> t.Type[GIRestAsyncParameterDecorator]:
        return GIRestAsyncParameterDecorator

    @property
    def _response_decorator_cls(self) -> t.Type[AsyncResponseDecorator]:
        return AsyncResponseDecorator
