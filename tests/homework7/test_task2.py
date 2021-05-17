from homework7.task2 import backspace_compare


def test_backspace_string_compare():

    assert backspace_compare("ab#c", "ad#c") is True
    assert backspace_compare("a##c", "#a#c") is True
    assert backspace_compare("a#c", "b") is False
