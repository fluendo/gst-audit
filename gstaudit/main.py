# Usage
# PID=1898951 fastapi dev gstaudit.py
# PID: The PID of the process creating the pipeline

# Ideas
# Add a SSE for the gst debug logs (DONE)
# Add a SSE for the GstBus messages, the ones that go to the application


import sys
import logging
import asyncio
from contextlib import asynccontextmanager

import colorlog
from fastapi import FastAPI
from pydantic import BaseModel
from pydantic_settings import BaseSettings
import frida

from gstaudit.router import GIRouter
from gstaudit.decorators import sse_handler

script = None

logger = logging.getLogger("gstaudit")

logger_levels = {
    "critical": logging.CRITICAL,
    "error": logging.ERROR,
    "warning": logging.WARNING,
    "info": logging.INFO,
    "debug": logging.DEBUG,
}

# Settings example
class Settings(BaseSettings):
    pid: int

settings = Settings()

def call_symbol(method, t, **kwargs):
    # Call the symbol from the JS exports
    print(f"Calling {method.get_symbol()} with type {t} and args {kwargs}")
    return script.exports_sync.call(method.get_symbol(), t, *kwargs.values())

def configure_logger(log_cat):
    stream_handle = colorlog.StreamHandler()
    formatter = colorlog.ColoredFormatter(
        "[%(asctime)s] %(log_color)s%(levelname)s%(reset)s %(filename)s:%(lineno)s %(message)s"
    )

    stream_handle.setFormatter(formatter)
    logger.addHandler(stream_handle)

    level = logger_levels[log_cat]
    logger.setLevel(level)


def on_log(level, message):
    levels = {
        "debug": logging.DEBUG,
        "info": logging.INFO,
        "warn": logging.WARNING,
        "error": logging.ERROR,
    }
    logger.log(levels[level], message)


def on_message(message, data):
    if message["type"] != "send":
        return
    elif message["payload"]["kind"] == "callback":
        logger.debug(f"Callback data at {message['payload']['data']['id']} received")
        callbacks_data.append(message["payload"]["data"])
        callbacks_event.set()


@asynccontextmanager
async def lifespan(app: FastAPI):
    session = frida.attach(settings.pid)
    with open('gstaudit.js', 'r') as f:
        global script
        script = session.create_script(f.read())
    script.on('message', on_message)
    script.set_log_handler(on_log)
    script.load()
    script.exports_sync.init();
    yield
    script.exports_sync.shutdown();
    session.detach()


app = FastAPI(lifespan=lifespan)    
app.include_router(GIRouter('Gst', call_symbol))

# TODO for the lists use circular queues
callbacks_data: list[tuple[int, dict]] = []
callbacks_event = asyncio.Event()

configure_logger("debug");

@app.get("/Application/callbacks")
@sse_handler()
async def callbacks():
    idx = 0
    while True:
        for d in callbacks_data[idx:]:
            yield d
            idx += 1
        await callbacks_event.wait()
        callbacks_event.clear()

@app.get("/Application/pipelines/")
def pipeline_list() -> list[int]:
    # TODO use a new pydantic type for pointers
    return [int(i, 16) for i in script.exports_sync.enumerate_pipelines()]
