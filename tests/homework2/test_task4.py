from homework2.task4 import cache, func


def test_cache():
    cache_func = cache(func)
    some = 3, 4
    val_1 = cache_func(*some)
    val_2 = cache_func(*some)
    assert val_1 == val_2
