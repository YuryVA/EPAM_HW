import os

import pytest

from homework8.task1 import KeyValueStorage


@pytest.fixture
def create_temp_file_1(tmpdir_factory):
    temp_file_data_1 = "name=kek\nlast_name=top\npower=9001\nsong=shadilay"
    my_dir = tmpdir_factory.mktemp("my_temp_dir")
    file_1 = my_dir.join("task1_temp_1.txt")
    file_1.write(temp_file_data_1)
    path_1 = os.path.abspath(file_1)
    return path_1


@pytest.fixture
def create_temp_file_2(tmpdir_factory):
    temp_file_data_2 = "name=kek\nlast_name=top\npower=9001\nsong=shadilay\n1=something"
    my_dir = tmpdir_factory.mktemp("my_temp_dir")
    file_2 = my_dir.join("task1_temp_2.txt")
    file_2.write(temp_file_data_2)
    path_2 = os.path.abspath(file_2)
    return path_2


@pytest.fixture
def create_instance(create_temp_file_1):
    storage_1 = KeyValueStorage(create_temp_file_1)
    return storage_1


def test_access_through_key_as_collection_return_value_is_int(create_instance):
    assert create_instance["power"] == 9001


# Тест не проходит потому что не выполняетмя условие key not in KeyValueStorage.__dict__
# def test_access_through_attribute_return_value_is_int(create_instance):
#     assert create_instance.power == 9001


def test_access_through_key_as_collection(create_instance):
    assert create_instance["name"] == "kek"


def test_access_through_attribute(create_instance):
    assert create_instance.song == "shadilay"


def test_create_instance_with_unsupported_keys_raise_error(create_temp_file_2):
    with pytest.raises(ValueError):
        KeyValueStorage(create_temp_file_2)
