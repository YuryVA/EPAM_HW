def instances_counter(cls):
    """
    Декоратор, который добавляет любому класс 2 метода:
    get_created_instances - возвращает количество созданых экземпляров класса
    reset_instances_counter - сбросить счетчик экземпляров, возвращает значение до сброса
    """

    setattr(cls, "n", 0)

    def __init__(self):
        cls.n += 1

    def get_created_instances(self=None):
        return cls.n

    def reset_instances_counter(self=None):
        last_num_of_inst = cls.n
        cls.n = 0
        return last_num_of_inst

    setattr(cls, "__init__", __init__)
    setattr(cls, "get_created_instances", get_created_instances)
    setattr(cls, "reset_instances_counter", reset_instances_counter)

    return cls


@instances_counter
class User:
    pass
