from homework2.task1 import (count_non_ascii_chars, count_punctuation_chars,
                             get_longest_diverse_words,
                             get_most_common_non_ascii_char, get_rarest_char)


def test_get_longest_diverse_words():
    assert get_longest_diverse_words("homework2\data.txt") == [
        "Bev\\u00f6lkerungsabschub",
        "Machtbewu\\u00dftsein",
        "Entz\\u00fcndbarkeit",
        "r\\u00e9sistance-Bewegungen",
        "Zahlenverh\\u00e4ltnis",
        "sch\\u00e4ftsinhabers",
        "ber\\u00fccksichtigen",
        "Zahlenverh\\u00e4ltnisse",
        "Termitenh\\u00fcgel",
        "\\u00dcberv\\u00f6lkerung",
    ]


def test_get_rarest_char():
    assert get_rarest_char("homework2\data.txt") == "Y, X, (, )"


def test_count_punctuation_chars():
    assert count_punctuation_chars("homework2\data.txt") == 5255


def test_count_non_ascii_chars():
    assert count_non_ascii_chars("homework2\data.txt") == 2843


def test_get_most_common_non_ascii_char():
    assert get_most_common_non_ascii_char("homework2\data.txt") == "\\u00e4"
