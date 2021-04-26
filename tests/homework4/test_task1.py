import os
import tempfile
import unittest

from homework4.task1 import read_magic_number


def test_read_magic_number():
    with tempfile.TemporaryDirectory() as temp_test_dir:
        temp_test_filepath = os.path.join(temp_test_dir, "temp_test_fi.txt")
        with open(temp_test_filepath, "w") as tmp_fi:
            tmp_fi.write("1")
        assert read_magic_number(temp_test_filepath) is True
    with tempfile.TemporaryDirectory() as temp_test_dir:
        temp_test_filepath = os.path.join(temp_test_dir, "temp_test_fi.txt")
        with open(temp_test_filepath, "w") as tmp_fi:
            tmp_fi.write("3")
        assert read_magic_number(temp_test_filepath) is False
    with tempfile.TemporaryDirectory() as temp_test_dir:
        temp_test_filepath = os.path.join(temp_test_dir, "temp_test_fi.txt")
        with open(temp_test_filepath, "w") as tmp_fi:
            tmp_fi.write("some text")

        class MyTestExcep(unittest.TestCase):
            def test_excep(self):
                with self.assertRaises(ValueError):
                    read_magic_number(temp_test_filepath)

        if __name__ == "__main__":
            unittest.main()
