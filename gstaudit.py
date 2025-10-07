# Usage
# PID=1898951 fastapi dev gstaudit.py
# PID: The PID of the process creating the pipeline

# Ideas
# Add a SSE for the gst debug logs (DONE)
# Add a SSE for the GstBus messages, the ones that go to the application


import sys
import logging
import asyncio

import colorlog
from fastapi import FastAPI
from fastapi_sse import sse_handler
from pydantic import BaseModel
from pydantic_settings import BaseSettings
import frida

from router import GIRouter

logger = logging.getLogger("gstaudit")

logger_levels = {
    "critical": logging.CRITICAL,
    "error": logging.ERROR,
    "warning": logging.WARNING,
    "info": logging.INFO,
    "debug": logging.DEBUG,
}

# Example on how to serialize data from json to model to API
class GstDebug(BaseModel):
    category: str
    level: int
    file: str
    function: str
    line: int
    obj: str
    msg: str


# Settings example
class Settings(BaseSettings):
    pid: int


def call_symbol(method, **kwargs):
    def get_signature():
        s = ""
        # TODO handle return value
        if method.is_method():
            s += "p"
        for a in method.get_arguments(): 
            tag = a.get_type().get_tag_as_string()
            if tag in ["gboolean"]:
                s += "b"
            elif tag in ["gint8", "guint8"]:
                s += "c"
            elif tag in ["gint16", "guint16"]:
                s += "s"
            elif tag in ["gint32", "guint32"]:
                s += "i"
            elif tag in ["gint64", "guint64"]:
                s += "l"
            elif tag in ["utf8"]:
                s += "S"
            elif tag in ["gfloat"]:
                s += "f"
            elif tag in ["gdoable"]:
                s += "d"
            elif tag in ["void"]:
                s += "V"
            else:
                s += "p"
        return s

    # Call the symbol from the JS exports
    s = get_signature()
    print(f"Calling {method.get_symbol()} with signature {s} and args {kwargs}")
    return script.exports_sync.call(method.get_symbol(), s, *kwargs.values())
    

settings = Settings()
app = FastAPI()
app.include_router(GIRouter('Gst', call_symbol))

messages: list[GstDebug] = []
new_message_event = asyncio.Event()

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
    if message["payload"]["kind"] == "debug":
        d = GstDebug(**message["payload"]["data"])
        messages.append(d)
        new_message_event.set()
    return


@app.get("/pipelines/")
def pipeline_list():
    return script.exports_sync.enumerate_pipelines()

@app.get("/pipelines/{pid}/name")
def pipeline_name(pid: str):
    return {"name": "Hello"}

@app.get("/logs")
@sse_handler()
async def logs():
    message_idx = 0
    while True:
        for message in messages[message_idx:]:
            yield message
            message_idx += 1
        await new_message_event.wait()
        new_message_event.clear()


configure_logger("debug");

session = frida.attach(settings.pid)
with open('gstaudit.js', 'r') as f:
    script = session.create_script(f.read())
    script.on('message', on_message)
    #script.set_log_handler(on_log)
    script.load()
