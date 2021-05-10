import datetime
import time

from homework5.task1 import Student, Teacher

teacher = Teacher("Daniil", "Shadrin")
student = Student("Roman", "Petrov")
homework_1 = teacher.create_homework("create 2 simple classes", 5)
now_time = datetime.datetime.now()
homework_2 = teacher.create_homework("Learn functions", 0)


def test_teacher():
    assert teacher.last_name == "Shadrin"
    assert teacher.first_name == "Daniil"


def test_student():
    assert student.last_name == "Petrov"
    assert student.first_name == "Roman"
    time.sleep(1)
    assert student.do_homework(homework_2) is None


def test_homework():
    assert homework_1.created == now_time
    assert homework_1.text == "create 2 simple classes"
    assert homework_1.deadline == datetime.timedelta(days=5)
    assert homework_1.is_active() is True
    assert homework_2.is_active() is False
