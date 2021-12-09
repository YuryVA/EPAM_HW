from homework2.task5 import custom_range


def test_custom_range():
    import string

    assert custom_range(string.ascii_lowercase, "d") == ["a", "b", "c"]
    assert custom_range(string.ascii_lowercase, "g", "p") == [
        "g",
        "h",
        "i",
        "j",
        "k",
        "l",
        "m",
        "n",
        "o",
    ]
    assert custom_range(string.ascii_lowercase, "g", "p", 2) == [
        "g",
        "i",
        "k",
        "m",
        "o",
    ]
    assert custom_range(string.ascii_lowercase, "p", "g", -2) == [
        "p",
        "n",
        "l",
        "j",
        "h",
    ]
    assert custom_range(string.ascii_lowercase, "a") == []
