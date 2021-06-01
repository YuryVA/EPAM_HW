from contextlib import contextmanager


class suppressor_cl:
    """
    Class - context manager, that suppresses passed exception
    """

    def __init__(self, exc):
        self.exc = exc
        self.exc_name = exc.__name__

    def __enter__(self):
        pass

    def __exit__(self, *args):
        print(f"{self.exc_name} had suppressed by class")


@contextmanager
def suppressor_gen(exc):
    """
    Generator - context manager, that suppresses passed exception
    """

    exc_name = exc.__name__

    try:
        yield
    finally:
        print(f"{exc_name} had suppressed by generator")


if __name__ == "__main__":
    with suppressor_cl(IndexError):
        ...
    with suppressor_gen(IndexError):
        ...
