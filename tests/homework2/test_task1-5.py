from homework2.task1 import get_most_common_non_ascii_char


def test_get_most_common_non_ascii_char():
    assert get_most_common_non_ascii_char("homework2/data.txt") == "ä"
