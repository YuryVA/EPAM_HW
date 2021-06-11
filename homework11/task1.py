class SimplifiedEnum(type):
    """
    should implement instances of __keys attribute
    to attribute's names of the class with same value
    """

    def __new__(cls, clsname, bases, dct):

        for name in dct[f"_{clsname}__keys"]:
            dct[name] = name

        return super(SimplifiedEnum, cls).__new__(cls, clsname, bases, dct)
