import logging

from uvicorn.config import LOGGING_CONFIG
from uvicorn.logging import DefaultFormatter

# Setup the log
# Use the same logger Uvicorn uses
handler = logging.StreamHandler()
handler.setFormatter(DefaultFormatter(fmt=LOGGING_CONFIG["formatters"]["default"]["fmt"]))
logger = logging.getLogger("girest")
logger.handlers = []  # Remove any existing handlers
logger.addHandler(handler)
logger.setLevel(logging.DEBUG)
