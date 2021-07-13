from homework1.task3 import find_maximum_and_minimum


def test_find_maximum_and_minimum():
    assert find_maximum_and_minimum("homework1/task3_test.txt") == (3, 78)
