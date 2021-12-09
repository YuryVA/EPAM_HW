"""
Write a function that accepts another function as an argument. Then it
should return such a function, so the every call to initial one
should be cached.
def func(a, b):
    return (a ** b) ** 2
cache_func = cache(func)
some = 100, 200
val_1 = cache_func(*some)
val_2 = cache_func(*some)
assert val_1 is val_2
"""
from typing import Callable


def cache(func: Callable) -> Callable:
    cache_dct = {}

    def check_in_cache(a, b):
        if (a, b) in cache_dct.keys():
            return cache_dct[(a, b)]
        else:
            result = func(a, b)
            cache_dct[(a, b)] = result
            return result

    return check_in_cache


def func(a, b):
    return (a ** b) ** 2
