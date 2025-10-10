from inspect import Parameter, Signature
from typing import Optional

from gi.module import repository as repo
from fastapi import Request, APIRouter, status
from pydantic import BaseModel, create_model
from gi._gi import \
ConstantInfo, \
Direction, \
EnumInfo, \
ObjectInfo, \
StructInfo, \
FunctionInfo, \
CallbackInfo

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

        # Handle the return value
        ret = self._tag_to_rest(method.get_return_type().get_tag_as_string())
        # If we do return something
        if ret:
            rparams = {"return": ret }
            st = status.HTTP_200_OK
        else:
            rparams = None
            st = status.HTTP_204_NO_CONTENT

        # Override the params signature
        params = []
        # Add the request
        params.append(Parameter("_req", Parameter.POSITIONAL_OR_KEYWORD, annotation=Request))
        # Add self
        if method.is_method():
            params.append(Parameter("self", Parameter.POSITIONAL_OR_KEYWORD, annotation=int))
        skip = []
        for a in method.get_arguments():
            at = a.get_type()
            # Avoid skips
            if a in skip:
                continue
            # Skip the callbacks
            if at.get_tag_as_string() == "interface" and isinstance(at.get_interface(), CallbackInfo):
                # The callback id must be returned to the client, change the return value
                if not rparams:
                    rparams = {}
                    st = status.HTTP_200_OK
                rparams[a.get_name()] = int

                if a.get_closure() >= 0:
                    skip.append(method.get_arguments()[a.get_closure()])
                if a.get_destroy() >= 0:
                    skip.append(method.get_arguments()[a.get_destroy()])
                continue
            # Output parameters are returned as part of the response
            # For output parameters, handle them at the return type
            if a.get_direction() in [Direction.OUT, Direction.INOUT]:
                if not rparams:
                    rparams = {}
                    st = status.HTTP_200_OK
                rparams[a.get_name()] = self._tag_to_rest(at.get_tag_as_string())
                if a.get_direction() == Direction.OUT:
                    continue

            annotation = self._tag_to_rest(at.get_tag_as_string())
            if a.may_be_null():
                annotation = Optional[annotation]
                # FIXME we can not set a default value, because in python, a parameter
                # with default value can not be placed before a non-default parameter
                # solving that will imply a modification of the order of the parameters
                # complicating too much the process

            ip = Parameter(a.get_name(), Parameter.POSITIONAL_OR_KEYWORD, annotation=annotation)
            params.append(ip)

        # Create a Pydantic model for the rparams
        rmodel = None 
        if rparams:
            rmodel = create_model(f"{method.get_name()}_return_type", **rparams)

        # TODO handle functions that have a GError (throws)
        s = Signature(params, return_annotation=rmodel)
        ep = self._create_endpoint()
        ep.__signature__ = s
        ep.__annotations__ = {v.name: v.annotation for v in s.parameters.values()} | {"return": rmodel}
        ep.__defaults__ = (None, method, self._method_to_json(method))
        # Register
        self.add_api_route(api, ep, status_code=st)

    def _tag_to_rest(self, tag):
        if tag in ["gboolean"]:
            return bool 
        elif tag in ["gint32", "gint64", "guint32", "guint64"]:
            return int
        elif tag in ["utf8"]:
            return str
        elif tag in ["gfloat", "gdouble"]:
            return float
        elif tag in ["void"]:
            return None 
        else:
            return int

    def _type_to_json(self, t):
        tag = t.get_tag_as_string()
        if tag == "interface" and isinstance(t.get_interface(), CallbackInfo):
            return "callback"
        if tag in ["gboolean"]:
            return "bool"
        elif tag in ["gint8"]:
            return "int8"
        elif tag in ["guint8"]:
            return "uint8"
        elif tag in ["gint16"]:
            return "int16"
        elif tag in ["guint16"]:
            return "uint16"
        elif tag in ["gint32"]:
            return "int32"
        elif tag in ["guint32"]:
            return "uint32"
        elif tag in ["gint64"]:
            return "int64"
        elif tag in ["guint64"]:
            return "uint64"
        elif tag in ["utf8"]:
            return "string"
        elif tag in ["gfloat"]:
            return "float"
        elif tag in ["gdouble"]:
            return "double"
        elif tag in ["void"]:
            return "void" 
        else:
            return "pointer"

    def _callable_to_json(self, cb, is_method=False):
        ret = {}
        ret["arguments"] = []
        ret["is_method"] = is_method
        if is_method:
            # Prepend self
            ra = {
                "name": "this",
                "skipped": False,
                "closure": -1,
                "is_closure": False,
                "destroy": -1,
                "is_destroy": False,
                "direction": Direction.IN,
                "type": "pointer",
                "subtype": None
            }
            ret["arguments"].append(ra)
        for a in cb.get_arguments():
            ra = self._arg_to_json(a)
            ret["arguments"].append(ra)
        # Now the skips
        for r in ret["arguments"]:
            if r["closure"] >= 0:
                ret["arguments"][r["closure"]]["skipped"] = True
                ret["arguments"][r["closure"]]["is_closure"] = True
            if r["destroy"] >= 0:
                ret["arguments"][r["destroy"]]["skipped"] = True
                ret["arguments"][r["destroy"]]["is_destroy"] = True
            if r["direction"] == Direction.OUT:
                r["skipped"] = True
        return ret

    def _method_to_json(self, method):
        ret = self._callable_to_json(method, is_method=method.is_method())
        return ret

    def _arg_to_json(self, arg):
        ret = {}
        ret["name"] = arg.get_name()
        ret["skipped"] = False
        ret["closure"] = arg.get_closure()
        ret["is_closure"] = False
        ret["destroy"] = arg.get_destroy()
        ret["is_destroy"] = False
        ret["direction"] = arg.get_direction()
        ret["type"] = self._type_to_json(arg.get_type())
        ret["subtype"] = self._callable_to_json(arg.get_type().get_interface()) if ret["type"] == "callback" else None
        return ret

    def _create_endpoint(self):
        async def endpoint(_req=None, _method=None, _type=None, **kwargs):
            ret = self.call(_method, _type, **kwargs)
            # TODO handle functions that have a GError to return a proper HTTP status
            return ret
        return endpoint
