## GIRest
* The refcounting of handles in callbacks must be handled there, otherwise, due the
  scope of the callback, the reference might be lost
* The generator for classes with same methods as the parent have problems, they need
  to be renamed

## GStreamer
* `gst_iterator_next` the parameter `elem` must be inout. The function expects the value
  to have been initialized or at least zeroed with `g_value_unset` therefore it requires
  the value to have a specific state
