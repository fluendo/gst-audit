# Check
# https://stackoverflow.com/questions/73291228/add-route-to-fastapi-with-custom-path-parameters

import inspect

from gi.module import repository as repo
from fastapi import Request, APIRouter
from gi._gi import \
ConstantInfo, \
EnumInfo, \
ObjectInfo, \
StructInfo, \
FunctionInfo

class GIRouter(APIRouter):
    def __init__(self, namespace, call, **kwargs):
        self.namespace = namespace
        self.call = call
        if not "prefix" in kwargs:
            kwargs["prefix"] = f"/{namespace}"
        super().__init__(**kwargs)
        self._generate_routes()

    def _generate_routes(self):
        repo.require(self.namespace)
        for i in repo.get_infos(self.namespace):
            if isinstance(i, ConstantInfo):
                continue
            elif isinstance(i, StructInfo):
                self._generate_methods(i.get_methods(), i.get_name())
            elif isinstance(i, ObjectInfo):
                self._generate_methods(i.get_methods(), i.get_name())
            elif isinstance(i, FunctionInfo):
                self._generate_method(i)
                continue

    def _generate_methods(self, methods, obj):
        for m in methods:
            self._generate_method(m, obj)

    def _generate_method(self, method, obj=None):
        # Generate the path
        api = ""
        if obj:
            api += f"/{obj}"
        if method.is_method():
            api += "/{self}"
        api += f"/{method.get_name()}"

        # Override the signature
        params = []
        # Add the request
        params.append(inspect.Parameter("_req", inspect.Parameter.POSITIONAL_OR_KEYWORD, annotation=Request))
        # Add self
        if method.is_method():
            params.append(inspect.Parameter("self", inspect.Parameter.POSITIONAL_OR_KEYWORD, annotation=int))
        for a in method.get_arguments():
            at = a.get_type()
            ip = inspect.Parameter(a.get_name(), inspect.Parameter.POSITIONAL_OR_KEYWORD, annotation=self._tag_to_python(a.get_type().get_tag_as_string()))
            params.append(ip)
        # TODO handle the return value
        # TODO handle functions that have a GError
        s = inspect.Signature(params)
        ep = self._create_endpoint()
        ep.__signature__ = s
        ep.__annotations__ = {v.name: v.annotation for v in s.parameters.values()}
        ep.__defaults__ = (None, method,)
        # Register
        self.add_api_route(api, ep)

    def _tag_to_python(self, tag):
        if tag in ["gboolean"]:
            return bool 
        elif tag in ["gint32", "gint64", "guint32", "guint64"]:
            return int
        elif tag in ["utf8"]:
            return str
        elif tag in ["gfloat", "gdouble"]:
            return float
        else:
            return int

    def _create_endpoint(self):
        async def endpoint(_req=None, _method=None, **kwargs):
            self.call(_method, **kwargs)
            # TODO get the return value
            # TODO handle functions that have a GError to return a proper HTTP status
            return {"called_path": _req.url.path}
        return endpoint
