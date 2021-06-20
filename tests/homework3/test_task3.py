from homework3 import task3 as t3


def test_class_filter():
    positive_even = t3.Filter(
        [lambda a: a % 2 == 0, lambda a: a > 0, lambda a: isinstance(a, int)]
    )
    assert positive_even.apply(range(100)) == [
        x for x in range(100) if x % 2 == 0 and x > 0
    ]


def test_make_filter():
    sample_data = [
        {
            "name": "Bill",
            "last_name": "Gilbert",
            "occupation": "was here",
            "type": "person",
        },
        {"is_dead": True, "kind": "parrot", "type": "bird", "name": "polly"},
    ]
    filtered_data = [
        {"is_dead": True, "kind": "parrot", "type": "bird", "name": "polly"}
    ]
    assert t3.make_filter(name="polly", type="bird").apply(sample_data) == filtered_data
