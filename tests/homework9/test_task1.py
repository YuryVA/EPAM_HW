import os
from collections.abc import Iterator

import pytest

from homework9.task1 import merge_sorted_files


@pytest.fixture
def create_temp_file_1(tmpdir_factory):
    temp_file_data_1 = "1\n3\n5\n7"
    my_dir = tmpdir_factory.mktemp("my_temp_dir")
    file_1 = my_dir.join("file1.txt")
    file_1.write(temp_file_data_1)
    path_1 = os.path.abspath(file_1)
    return path_1


@pytest.fixture
def create_temp_file_2(tmpdir_factory):
    temp_file_data_2 = "2\n4\n6\n8"
    my_dir = tmpdir_factory.mktemp("my_temp_dir")
    file_2 = my_dir.join("file2.txt")
    file_2.write(temp_file_data_2)
    path_2 = os.path.abspath(file_2)
    return path_2


@pytest.fixture
def create_object_merge_sorted_files(create_temp_file_1, create_temp_file_2):
    it = merge_sorted_files([create_temp_file_1, create_temp_file_2])
    return it


def test_merge_sorted_files_is_iterator(create_object_merge_sorted_files):
    assert issubclass(type(create_object_merge_sorted_files), Iterator) is True


def test_merge_sorted_files_return_list_of_items(create_object_merge_sorted_files):
    assert list(create_object_merge_sorted_files) == [1, 2, 3, 4, 5, 6, 7, 8]
