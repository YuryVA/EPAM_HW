"""
Write a function that takes K lists as arguments and returns all possible
lists of K items where the first element is from the first list,
the second is from the second and so one.
You may assume that that every list contain at least one element
Example:
assert combinations([1, 2], [3, 4]) == [
    [1, 3],
    [1, 4],
    [2, 3],
    [2, 4],
]
"""
from typing import Any, List


def combinations(*args: List[Any]) -> List[List]:
    """returns all possible combinations of elements of lists"""

    if len(args) == 1:
        return list(args)

    comb_list = []
    if len(args) == 2:
        for elem1 in args[0]:
            for elem2 in args[1]:
                comb_list.append([elem1, elem2])
        return comb_list

    A = args[0]
    B = args[1]
    comb_list_f = []
    for i in range(len(args) - 1):
        for elem1 in A:
            for elem2 in B:
                comb_list.append(str(elem1) + str(elem2))
        if i < len(args) - 2:
            A = comb_list
            B = args[i + 2]
            comb_list = []
    for elem in comb_list:
        elem_list = list(map(int, elem))
        comb_list_f.append(elem_list)
    return comb_list_f
