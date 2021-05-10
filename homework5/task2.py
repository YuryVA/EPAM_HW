import functools


def wraps(func):
    """
    Декоратор который позволит сохранять информацию из
    исходной функции (__name__ and __doc__), а так же сохранит саму
    исходную функцию в атрибуте __original_func

    Ожидаемый результат:
    print(custom_sum.__doc__)  # 'This function can sum any objects which have __add___'
    print(custom_sum.__name__)  # 'custom_sum'
    print(custom_sum.__original_func)  # <function custom_sum at <some_id>>
    """

    def update_wrapper(wrapper, wrapped):
        setattr(wrapper, "__doc__", getattr(wrapped, "__doc__"))
        setattr(wrapper, "__name__", getattr(wrapped, "__name__"))
        setattr(wrapper, "__original_func", wrapped)
        return wrapper

    return functools.partial(update_wrapper, wrapped=func)


def print_result(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        """Function-wrapper which print result of an original function"""
        result = func(*args, **kwargs)
        print(result)
        return result

    return wrapper


@print_result
def custom_sum(*args):
    """This function can sum any objects which have __add___"""
    return functools.reduce(lambda x, y: x + y, args)
