from homework1.task4 import check_sum_of_four


def test_check_sum_of_four():
    A = [1, 45, 100]
    B = [4, 5, 9]
    C = [-12, 3, 27, 14, 0]
    D = [2, 33, -105]
    assert check_sum_of_four(A, B, C, D) == 2
