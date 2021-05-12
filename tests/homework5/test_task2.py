from homework5.task2 import custom_sum


def test_wrapper_replace__doc():
    assert custom_sum.__doc__ == "This function can sum any objects which have __add___"


def test_wrapper_replace__name():
    assert custom_sum.__name__ == "custom_sum"


def test_wrapper_add__original_func_attr():
    args = (1, 2, 3, 4)
    assert custom_sum.__original_func(args) == custom_sum(args)
