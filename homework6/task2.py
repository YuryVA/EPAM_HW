import datetime
from collections import defaultdict


class DeadlineError(Exception):
    pass


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
        возвращает bool
    """

    created = datetime.datetime.now()

    def __init__(self, text, n_days):
        self.text = text
        self.deadline = datetime.timedelta(days=n_days)

    def is_active(self):
        now = datetime.datetime.now()
        last_day_is_active = self.created + self.deadline
        return last_day_is_active >= now


class HomeworkResult:
    """
    Принимает объект автора задания, принимает исходное задание и его решение в виде строки
    Если передан не класс Homework выкидывает исключение с сообщением:
        'You gave a not Homework object'
    Атрибуты:
        homework - для объекта Homework
        solution - хранит решение ДЗ как строку
        author - хранит объект Student
        created - c точной датой и временем создания
    """

    created = datetime.datetime.now()

    def __init__(self, author, homework, solution):
        self.solution = solution
        self.author = author
        if isinstance(homework, Homework):
            self.homework = homework
        else:
            raise ValueError("You gave a not Homework object")


class Student:
    """
    Атрибуты:
        last_name
        first_name
    Методы:
        do_homework - принимает объект Homework и возвращает его же,
        если задание уже просрочено, то исключение DeadlineError с сообщением 'You are late' и возвращает None
    """

    def __init__(self, first_name, last_name):
        self.first_name = first_name
        self.last_name = last_name

    def do_homework(self, homework, solution):
        if homework.is_active():
            return HomeworkResult(author=self, homework=homework, solution=solution)
        raise DeadlineError("You are late")


class Teacher(Student):
    """
    Атрибуты:
         last_name
         first_name
         homework_done - сюда поподают все HomeworkResult после успешного прохождения check_homework
    Методы:
        create_homework - текст задания и количество дней на это задание,
        возвращает экземпляр Homework
        check_homework -  возвращает True если ответ студента больше 5 символов,
        так же при успешной проверке добавить в homework_done.
        reset_results - если передать экземпряр Homework - удаляет только
        результаты этого задания из homework_done, если ничего не передавать,
        то полностью обнулит homework_done.
    """

    homework_done = defaultdict(set)

    def __init__(self, first_name, last_name):
        super().__init__(first_name, last_name)

    @staticmethod
    def create_homework(text, n_days):
        return Homework(text, n_days)

    def check_homework(self, homework_res):
        if len(homework_res.solution) > 5:
            self.homework_done[homework_res.homework].add(homework_res.solution)
            return True
        return False

    @classmethod
    def reset_results(cls, homework=None):
        if homework:
            cls.homework_done[homework] = set()
        else:
            cls.homework_done = defaultdict(set)
