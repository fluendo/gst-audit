## GIRest
* The refcounting of handles in callbacks must be handled there, otherwise, due the
  scope of the callback, the reference might be lost
* The generator for classes with same methods as the parent have problems, they need
  to be renamed
* The errors are just about the ES5 target and missing ES2015 features like FinalizationRegistry and Promise,
  which is expected since we didn't provide a tsconfig.json. Let me verify with the proper target:

## GStreamer
