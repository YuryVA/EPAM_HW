"""
Given an array of size n, find the most common and the least common elements.
The most common element is the element that appears more than n // 2 times.
The least common element is the element that appears fewer than other.
You may assume that the array is non-empty and the most common element
always exist in the array.
Example 1:
Input: [3,2,3]
Output: 3, 2
Example 2:
Input: [2,2,1,1,1,2,2]
Output: 2, 1
"""
from typing import List, Tuple


def major_and_minor_elem(inp: List) -> Tuple[int, int]:
    """find the most common and the least common elements in array"""
    elem_count = {}
    for elem in inp:
        elem_count[elem] = elem_count.get(elem, 0) + 1
    major_elem = sorted(elem_count.items(), key=lambda x: x[1])[-1][0]
    minor_elem = sorted(elem_count.items(), key=lambda x: x[1])[0][0]
    return major_elem, minor_elem


if __name__ == "__main__":
    print(major_and_minor_elem([3, 2, 3]))
    print(major_and_minor_elem([2, 2, 1, 1, 1, 2, 2]))
