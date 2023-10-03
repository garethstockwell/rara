# Remove text

def get_shape(label: str) -> SimpleObject:
  for s in all_shapes():
    if s.get_inkex_object().label == label:
      return s

get_shape("text").remove()
