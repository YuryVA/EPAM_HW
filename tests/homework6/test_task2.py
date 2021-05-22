import datetime
import time
from collections import defaultdict

import pytest

from homework6.task2 import DeadlineError, HomeworkResult, Student, Teacher

opp_teacher = Teacher("Daniil", "Shadrin")
advanced_python_teacher = Teacher("Aleksandr", "Smetanin")

lazy_student = Student("Roman", "Petrov")
good_student = Student("Lev", "Sokolov")

oop_hw = opp_teacher.create_homework("Learn OOP", 0)
docs_hw = opp_teacher.create_homework("Read docs", 5)

result_1 = good_student.do_homework(oop_hw, "I have done this hw")
result_2 = good_student.do_homework(docs_hw, "I have done this hw too")
result_3 = lazy_student.do_homework(docs_hw, "done")
result_5 = lazy_student.do_homework(oop_hw, "I have done this hw")


def test_teacher_first_name_last_name():
    assert opp_teacher.last_name == "Shadrin"
    assert advanced_python_teacher.first_name == "Aleksandr"


def test_student_first_name_last_name():
    assert lazy_student.last_name == "Petrov"
    assert good_student.first_name == "Lev"


def test_student_late_with_homework_raises_deadline_error():
    time.sleep(1)
    with pytest.raises(DeadlineError) as exc:
        lazy_student.do_homework(oop_hw, "I have done this hw")
    exc_message = exc.value.args[0]
    assert exc_message == "You are late"


def test_not_homework_obj_passed_to_homework_raises_error():
    with pytest.raises(ValueError) as exc:
        result_4 = HomeworkResult(good_student, "fff", "Solution")
    exc_message = exc.value.args[0]
    assert exc_message == "You gave a not Homework object"


def test_homework_text_and_deadline():
    assert oop_hw.text == "Learn OOP"
    assert docs_hw.deadline == datetime.timedelta(days=5)


def test_homework_is_active_return_true():
    assert docs_hw.is_active() is True


def test_homework_is_active_return_false():
    assert oop_hw.is_active() is False


def test_teacher_check_homework_return_false():
    assert opp_teacher.check_homework(result_3) is False


def test_teacher_check_homework_return_true():
    assert opp_teacher.check_homework(result_1) is True


def test_no_duplicates_in_homework_done_dict():
    opp_teacher.check_homework(result_1)
    temp_1 = opp_teacher.homework_done
    advanced_python_teacher.check_homework(result_1)
    temp_2 = Teacher.homework_done
    assert temp_1 == temp_2


def test_remove_homework_result_from_homework_done_dict():
    Teacher.reset_results(oop_hw)
    assert Teacher.homework_done[oop_hw] == set()


def test_clear_homework_done_dict():
    Teacher.reset_results()
    assert Teacher.homework_done == defaultdict(set)
