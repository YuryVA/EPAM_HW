from homework2.task1 import get_rarest_char


def test_get_rarest_char():
    assert get_rarest_char("data.txt") == "Y, X, (, )"
