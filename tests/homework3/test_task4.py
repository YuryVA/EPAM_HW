from homework3.task4 import is_armstrong


def test_is_armstrong():
    assert is_armstrong(153) is True
    assert is_armstrong(10) is False
