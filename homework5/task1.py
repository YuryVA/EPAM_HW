import datetime


class Homework:
    """
    Homework принимает на вход 2 атрибута: текст задания и количество дней на это задание
    Атрибуты:
        text - текст задания
        deadline - хранит объект datetime.timedelta с количеством
        дней на выполнение
        created - c точной датой и временем создания
    Методы:
        is_active - проверяет не истекло ли время на выполнение задания,
        возвращает boolean
    """

    created = datetime.datetime.now()

    def __init__(self, text, n_days):
        self.text = text
        self.deadline = datetime.timedelta(days=n_days)

    def is_active(self):
        now = datetime.datetime.now()
        last_day_is_active = self.created + self.deadline
        return last_day_is_active >= now


class Student:
    """
    Атрибуты:
        last_name
        first_name
    Методы:
        do_homework - принимает объект Homework и возвращает его же,
        если задание уже просрочено, то печатет 'You are late' и возвращает None
    """

    def __init__(self, first_name, last_name):
        self.first_name = first_name
        self.last_name = last_name

    def do_homework(self, homework):
        if homework.is_active():
            return homework
        print("You are late")


class Teacher:
    """
    Атрибуты:
         last_name
         first_name
    Методы:
        create_homework - текст задания и количество дней на это задание,
        возвращает экземпляр Homework
    """

    def __init__(self, first_name, last_name):
        self.first_name = first_name
        self.last_name = last_name

    def create_homework(self, text, n_days):
        homework = Homework(text, n_days)
        return homework
