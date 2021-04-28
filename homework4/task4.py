"""
Write a function that takes a number N as an input and returns N FizzBuzz numbers*
Write a doctest for that function.
Definition of done:
 - function is created
 - function is properly formatted
 - function has doctests
 - doctests are run with pytest command
You will learn:
 - the most common test task for developers
 - how to write doctests
 - how to run doctests
assert fizzbuzz(5) == ["1", "2", "fizz", "4", "buzz"]
* https://en.wikipedia.org/wiki/Fizz_buzz
** Энциклопедия профессора Фортрана page 14, 15, "Робот Фортран, чисть картошку!"
"""
from typing import List


def fizzbuzz(n: int) -> List[str]:
    """takes a number N as an input and returns N FizzBuzz numbers
    >>> fizzbuzz(5)
    ['1', '2', 'fizz', '4', 'buzz']
    >>> fizzbuzz(0)
    []
    >>> fizzbuzz(1)
    ['1']
    >>> fizzbuzz(-5)
    []
    """

    fizzbuzz_list = []
    i = 1
    while i <= n:
        if i % 3 == 0 and i % 5 == 0:
            fizzbuzz_list.append("fizz buzz")
        elif i % 3 == 0:
            fizzbuzz_list.append("fizz")
        elif i % 5 == 0:
            fizzbuzz_list.append("buzz")
        else:
            fizzbuzz_list.append(str(i))
        i += 1
    return fizzbuzz_list



if __name__ == '__main__':
    import doctest
    doctest.testmod()