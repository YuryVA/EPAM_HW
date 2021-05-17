from typing import Any


def find_occurrences(tree: dict, element: Any) -> int:
    """
    takes element and finds the number of occurrences of this element in the tree (dictionary).
    Tree can contains multiple nested structures.
    Tree can only contains basic structures like:
    str, list, tuple, dict, set, int, bool
    """
    n = 0

    def count_values_in_sequence(sequence, elem, n):
        for item in sequence:
            if isinstance(item, dict):
                n = count_values_in_dct(item, elem, n)
            elif isinstance(item, str) and item == elem:
                n += 1
            elif isinstance(item, int) and item == elem:
                n += 1
            elif isinstance(item, bool) and item == elem:
                n += 1
            elif isinstance(item, (list, tuple, set)):
                n = count_values_in_sequence(item, elem, n)
        return n

    def count_values_in_dct(dct, elem, n):
        for value in dct.values():
            if isinstance(value, dict):
                n = count_values_in_dct(value, elem, n)
            elif isinstance(value, str) and value == elem:
                n += 1
            elif isinstance(value, int) and value == elem:
                n += 1
            elif isinstance(value, bool) and value == elem:
                n += 1
            elif isinstance(value, (list, tuple, set)):
                n = count_values_in_sequence(value, elem, n)
        return n

    return count_values_in_dct(tree, element, n)
