import os

import pytest

from homework9.task3 import universal_file_counter


@pytest.fixture
def create_temp_file(tmpdir_factory):
    temp_file_data_1 = """Write a function that takes directory path, a file extension and an optional tokenizer.
    It will count lines in all files with that extension if there are no tokenizer.
    If a the tokenizer is not none, it will count tokens."""
    temp_file_data_2 = """Write a context manager, that suppresses passed exception.
    Do it both ways: as a class and as a generator."""
    my_dir = tmpdir_factory.mktemp("my_temp_dir")
    file_1 = my_dir.join("file1.txt")
    file_1.write(temp_file_data_1)
    file_2 = my_dir.join("file2.txt")
    file_2.write(temp_file_data_2)
    path = os.path.abspath(my_dir)
    return path


def test_universal_file_counter_count_lines(create_temp_file):
    assert universal_file_counter(create_temp_file, "txt") == 5


def test_universal_file_counter_count_tokenz(create_temp_file):
    assert universal_file_counter(create_temp_file, "txt", str.split) == 59
