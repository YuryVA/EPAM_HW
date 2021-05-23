class KeyValueStorage:
    dct = {}

    def __init__(self, path):
        with open(path) as f:
            for entry in f.readlines():
                key, value = entry.rstrip().split("=")
                if key.isdigit():
                    raise ValueError(f"Value: {key} cannot be assigned to an attribute")
                elif key not in KeyValueStorage.__dict__ and value.isdigit():
                    setattr(KeyValueStorage, key, int(value))
                    self.dct[key] = int(value)
                else:
                    setattr(KeyValueStorage, key, value)
                    self.dct[key] = value

    def __getitem__(self, item):
        return self.dct[item]
