from pydantic import BeforeValidator, WithJsonSchema
from typing import Annotated

def pointer_validator(value):
    if isinstance(value, int):
        return value
    if isinstance(value, str):
        s = value.strip()
        if s.lower().startswith("0x"):
            try:
                return int(s, 16)
            except ValueError:
                raise ValueError(f"Invalid hexadecimal string: {value}")
        elif s.isdigit():
            return int(s)
        else:
            raise ValueError(f"String must be a decimal or hex pointer: {value}")
    raise TypeError("Pointer must be int or str")

Pointer = Annotated[
    int | str,
    BeforeValidator(pointer_validator),
    WithJsonSchema(
        {
            "type": "string",
            "pattern": "^0x[0-9a-fA-F]+$|^[0-9]+$",
            "examples": ["0x1234abcd", "123456"]
        },
        # You can use mode="plain" for plain types
        mode="plain",
    )
]
