"""In previous homework task 4, you wrote a cache function that remembers other function output value.
    Modify it to be a parametrized decorator, so that the following code:

@cache(times=3)
def some_function():
    pass

Would give out cached value up to times number only. Example:

@cache(times=2)
def f():
    return input('? ')   # careful with input() in python2, use raw_input() instead

#>>> f()
? 1
'1'
#>>> f()     # will remember previous value
'1'
#>>> f()     # but use it up to two times only
'1'
#>>> f()
? 2
'2'
"""


def repeater(times):
    """give out cached value up to times number only"""

    def cache(func):
        cache_dct = {}
        counter = 0

        def wrapper(*args):
            key = args
            nonlocal counter
            if key in cache_dct and counter < times:
                counter += 1
                return f"This is {counter} result from cache: {cache_dct[(key)]}"
            result = func(*args)
            cache_dct[(key)] = result
            return f"This is new execution: {result}"

        return wrapper

    return cache
