from homework3.task1 import repeater


def test_repeater():
    @repeater(2)
    def simple_f(a, b):
        return f"This is a: {a}, this is b: {b}"

    assert simple_f(1, "W") == "This is new execution: This is a: 1, this is b: W"
    assert simple_f(1, "W") == "This is 1 result from cache: This is a: 1, this is b: W"
    assert simple_f(1, "W") == "This is 2 result from cache: This is a: 1, this is b: W"
    assert simple_f(1, "W") == "This is new execution: This is a: 1, this is b: W"

    @repeater(1)
    def simple_f(a, b):
        return f"This is a: {a}, this is b: {b}"

    assert simple_f(1, "W") == "This is new execution: This is a: 1, this is b: W"
    assert simple_f(1, "W") == "This is 1 result from cache: This is a: 1, this is b: W"
    assert simple_f(1, "W") == "This is new execution: This is a: 1, this is b: W"
