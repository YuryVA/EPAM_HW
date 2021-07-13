from homework1.task5 import find_maximal_subarray_sum


def test_find_maximal_subarray_sum():
    nums, k = [1, 3, -1, -3, 5, 3, 6, 7], 3
    assert find_maximal_subarray_sum(nums, k) == 16
