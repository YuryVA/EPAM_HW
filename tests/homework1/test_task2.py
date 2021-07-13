from homework1.task2 import check_fibonacci


def test_check_fibonacci():
    assert check_fibonacci([1, 1, 2, 3, 5, 8, 13, 21, 34, 55]) is True
    assert check_fibonacci([0, 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55]) is False
    assert check_fibonacci([-55, 34, -21, 13, -8, 5, -3, 2, -1]) is True
    assert check_fibonacci([1, 1, 2, 3, 4, 8, 13, 21, 34, 55]) is False
