from homework1.task2 import check_fibonacci

if __name__ == '__main__':
    assert check_fibonacci([1, 1, 2, 3, 5, 8, 13, 21, 34, 55]) == True
    assert check_fibonacci([-55, 34, -21, 13, -8, 5, -3, 2, -1]) == True
    assert check_fibonacci([1, 1, 2, 3, 4, 8, 13, 21, 34, 55]) == False
