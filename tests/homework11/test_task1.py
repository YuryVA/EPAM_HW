from homework11.task1 import SimplifiedEnum


def test_SimplifiedEnum_implements_new_attributes():
    class ColorsEnum(metaclass=SimplifiedEnum):
        __keys = ("RED", "BLUE", "ORANGE", "BLACK")

    class SizesEnum(metaclass=SimplifiedEnum):
        __keys = ("XL", "L", "M", "S", "XS")

    assert ColorsEnum.RED == "RED"

    assert SizesEnum.M == "M"
