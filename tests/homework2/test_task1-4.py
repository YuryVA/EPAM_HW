from homework2.task1 import count_non_ascii_chars


def test_count_non_ascii_chars():
    assert count_non_ascii_chars("homework2\data.txt") == 2843
