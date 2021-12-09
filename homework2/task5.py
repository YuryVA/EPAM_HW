"""
Some of the functions have a bit cumbersome behavior when we deal with
positional and keyword arguments.
Write a function that accept any iterable of unique values and then
it behaves as range function:
import string
assert = custom_range(string.ascii_lowercase, 'g') == ['a', 'b', 'c', 'd', 'e', 'f']
assert = custom_range(string.ascii_lowercase, 'g', 'p') == ['g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o']
assert = custom_range(string.ascii_lowercase, 'p', 'g', -2) == ['p', 'n', 'l', 'j', 'h']
"""
import string


def custom_range(unique_val, *args) -> list:

    out, cache = [], []
    count = 0

    if len(args) == 1:
        start_val = unique_val[0]
        stop_val = args[0]
        step = 1
    elif len(args) == 2 and type(args[1]) is str:
        start_val, stop_val = args
        step = 1
    elif len(args) == 2 and type(args[1]) is int:
        stop_val, step = args
        start_val = unique_val[0]
    else:
        start_val, stop_val, step = args
    if step < 0:
        unique_val = unique_val[::-1]

    for elem in unique_val:
        if elem == stop_val:
            return out
        elif elem == start_val:
            cache.append(elem)
        if start_val in cache:
            if count % step == 0:
                out.append(elem)
            count += 1
