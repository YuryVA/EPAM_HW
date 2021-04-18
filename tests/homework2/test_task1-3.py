from homework2.task1 import count_punctuation_chars


def test_count_punctuation_chars():
    assert count_punctuation_chars("homework2\\data.txt") == 5255
