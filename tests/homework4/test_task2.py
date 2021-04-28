import unittest
from unittest.mock import patch

from homework4.task2 import count_dots_on_i


class MyTestCase(unittest.TestCase):
    def test_count_dots_on_i_return_res(self):
        with patch("homework4.task2.requests.get") as mocked_get:
            mocked_get.return_value.ok = True
            mocked_get.return_value.text = "i" * 59

            url = "https://example.com/"

            result = count_dots_on_i(url)
            self.assertEqual(result, 59)

    def test_count_dots_on_i(self):
        with patch("homework4.task2.requests.get") as mocked_get:
            mocked_get.return_value.ok = True
            mocked_get.return_value.text = "i" * 59

            url = "https://example.com/"

            result = count_dots_on_i(url)
            self.assertEqual(result, 59)

            mocked_get.return_value.ok = False
            url = "https://eqxample.com/"

            result = count_dots_on_i(url)
            self.assertRaises(ValueError)


if __name__ == "__main__":
    unittest.main()
