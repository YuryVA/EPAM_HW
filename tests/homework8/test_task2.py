import os
import sqlite3

import pytest

from homework8.task2 import TableData


@pytest.fixture
def create_temp_file(tmpdir_factory):
    my_dir = tmpdir_factory.mktemp("my_temp_dir")
    file = my_dir.join("temp_example.sqlite")
    path = os.path.abspath(file)
    con = sqlite3.connect(path)
    cur = con.cursor()
    cur.execute("create table presidents (name, age, country)")
    presidents_list = [
        ("Yeltsin", 999, "Russia"),
        ("Trump", 1337, "USA"),
        ("Big Man Tyrone", 101, "Kekistan"),
    ]
    cur.executemany("insert into presidents values (?, ?, ?)", presidents_list)
    con.commit()
    cur.execute("create table books (name, author)")
    books_list = [
        ("Fahrenheit 451", "Bradbury"),
        ("Brave New World", "Huxley"),
        ("1984", "Orwell"),
    ]
    cur.executemany("insert into books values (?, ?)", books_list)
    con.commit()
    con.close()
    return path


@pytest.fixture
def create_presidents_object(create_temp_file):
    presidents = TableData(database_name=create_temp_file, table_name="presidents")
    return presidents


@pytest.fixture
def create_books_object(create_temp_file):
    books = TableData(database_name=create_temp_file, table_name="books")
    return books


def test_len_of_presidents_table(create_presidents_object):
    assert len(create_presidents_object) == 3


def test_len_of_books_table(create_books_object):
    assert len(create_books_object) == 3


def test_return_single_data_row_for_president_with_given_name(create_presidents_object):
    name = "Yeltsin"
    assert create_presidents_object[name] == [("Yeltsin", 999, "Russia")]


def test_return_single_data_row_for_book_with_given_name(create_books_object):
    name = "1984"
    assert create_books_object[name] == [("1984", "Orwell")]


def test_check_if_name_is_in_table_return_true(create_presidents_object):
    name = "Yeltsin"
    assert (name in create_presidents_object) is True


def test_check_if_name_not_in_table_return_false(create_books_object):
    name = "1985"
    assert (name in create_books_object) is False


def test_table_data_is_iterator(create_presidents_object):
    assert (
        hasattr(create_presidents_object, "__iter__")
        and hasattr(create_presidents_object, "__next__")
        and callable(create_presidents_object.__iter__)
        and create_presidents_object.__iter__() is create_presidents_object
    ) is True
