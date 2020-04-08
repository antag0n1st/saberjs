class Path:
  def __init__(self, name, base_path, full_path ,relative_path = ''):
    self.name = name
    self.base_path = base_path
    self.full_path = full_path
    self.relative_path = relative_path