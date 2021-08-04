import os
from pathlib import Path
from typing import Iterator, List, Union


def merge_sorted_files(file_list: List[Union[Path, str]]) -> Iterator:
    """
    merges integer from sorted files and returns an iterator
    """

    output = []
    for file_path in file_list:
        with open(file_path) as f:
            for number in f.readlines():
                output.append(int(number))
    for item in sorted(output):
        yield item
