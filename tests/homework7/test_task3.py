from homework7.task3 import tic_tac_toe_checker


def test_tic_tac_toe_desk_for_o_winner_column():
    desk = [["o", "x", "o"], ["x", "x", "o"], ["x", "o", "o"]]
    assert tic_tac_toe_checker(desk) == "o wins!"


def test_tic_tac_toe_desk_for_x_winner_diag():
    desk = [["o", "x", "x"], ["o", "x", "o"], ["x", "o", "o"]]
    assert tic_tac_toe_checker(desk) == "x wins!"


def test_tic_tac_toe_desk_for_x_winner_line():
    desk = [["x", "x", "x"], ["o", "x", "o"], ["-", "o", "-"]]
    assert tic_tac_toe_checker(desk) == "x wins!"


def test_tic_tac_toe_desk_for_draw():
    desk = [["o", "x", "o"], ["o", "x", "x"], ["x", "o", "o"]]
    assert tic_tac_toe_checker(desk) == "draw!"


def test_tic_tac_toe_desk_for_unfinished():
    desk = [["o", "x", "x"], ["o", "x", "o"], ["-", "o", "o"]]
    assert tic_tac_toe_checker(desk) == "unfinished!"
