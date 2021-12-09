from homework2.task3 import combinations


def test_combinations():
    assert combinations([1, 2]) == [[1, 2]]
    assert combinations([1, 2], [3, 4]) == [[1, 3], [1, 4], [2, 3], [2, 4]]
    assert combinations([1, 2], [3, 4], [5, 6]) == [
        [1, 3, 5],
        [1, 3, 6],
        [1, 4, 5],
        [1, 4, 6],
        [2, 3, 5],
        [2, 3, 6],
        [2, 4, 5],
        [2, 4, 6],
    ]
