"""
Given a cell with "it's a fib sequence" from slideshow,
    please write function "check_fib", which accepts a Sequence of integers, and
    returns if the given sequence is a Fibonacci sequence
We guarantee, that the given sequence contain >= 0 integers inside.
"""
from typing import Sequence


def check_fibonacci(data: Sequence[int]) -> bool:

    """Check if the given sequence is Fibonacci sequence"""

    data_begin = data[:2]
    data_end = data[2:]
    for num in data_end:
        if num - data_begin[-1] == data_begin[-2]:
            data_begin.append(num)
        else:
            return False
    return True
