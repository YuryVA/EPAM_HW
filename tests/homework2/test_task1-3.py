from homework2.task1 import count_punctuation_chars


def test_count_punctuation_chars():
    assert count_punctuation_chars("data.txt") == 5255
