from homework6.task1 import User


def test_if_instance_of_user_is_not_created():
    assert User.get_created_instances() == 0


def test_if_instance_of_user_is_created():
    user, _, _ = User(), User(), User()
    assert user.get_created_instances() == 3
    user.reset_instances_counter()


def test_reset_instances_counter():
    user, _, _ = User(), User(), User()
    assert user.reset_instances_counter() == 3
    assert user.reset_instances_counter() == 0
