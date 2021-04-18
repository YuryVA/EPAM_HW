from homework2.task1 import get_longest_diverse_words


def test_get_longest_diverse_words():
    assert get_longest_diverse_words("data.txt") == [
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
