import json
from functools import wraps
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import AsyncGenerator, Awaitable, Callable, ParamSpec


P = ParamSpec('P')
EventGeneratorFunc = Callable[P, AsyncGenerator[BaseModel, None]]
StreamingResponseFunc = Callable[P, Awaitable[StreamingResponse]]


def sse_handler(
) -> Callable[[EventGeneratorFunc], StreamingResponseFunc]:
    """
    Converts an async generator that yields data into a streaming
    response handler that formats each model as a Server-Sent Event.

    Args:
        argument: An async generator that yields arbitrary data. If None, the
            function will return a decorator that can be used to decorate an
            async generator.
    """
    def decorator(generator_func: EventGeneratorFunc) -> StreamingResponseFunc:
        @wraps(generator_func)
        async def streaming_handler(
            *args: P.args, **kwargs: P.kwargs
        ) -> StreamingResponse:
            generator_iterator = aiter(generator_func(*args, **kwargs))
            try:
                first_event = await anext(generator_iterator)
            except StopAsyncIteration:

                async def empty_generator():
                    return
                    yield

                return StreamingResponse(
                    empty_generator(), media_type='text/event-stream'
                )

            async def rewrapped_generator():
                yield first_event
                async for event in generator_iterator:
                    yield event

            return sse_response(rewrapped_generator())

        return streaming_handler

    return decorator


def sse_response(
    generator: AsyncGenerator[BaseModel, None]
) -> StreamingResponse:
    """
    Creates a StreamingResponse that formats each Pydantic model emitted by the
    generator as a Server-Sent Event.

    Args:
        generator: An async generator that yields Pydantic models.
    """

    async def event_source_wrapper():
        async for event in generator:
            message = ''
            message += f'data: {json.dumps(event)}\r\n'
            message += '\r\n'
            yield message.encode('utf-8')

    return StreamingResponse(
        event_source_wrapper(),
        media_type='text/event-stream',
        headers={'Cache-Control': 'no-cache', 'Connection': 'keep-alive'},
    )
