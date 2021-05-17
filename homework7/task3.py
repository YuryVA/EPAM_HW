from typing import List


def tic_tac_toe_checker(board: List[List]) -> str:
    """
    Checks if the are some winners on Tic-Tac-Toe 3x3 board.
    return "x wins!", if there is "x" winner
    return "o wins!", if there is "o" winner
    return "draw!", if there is a draw
    return "unfinished!", if board is unfinished
    """

    x_win = ["x", "x", "x"]
    o_win = ["o", "o", "o"]
    column_1, column_2, column_3 = [], [], []
    diag_1, diag_2 = [], []
    empty_val = False

    for ind, line in enumerate(board):
        column_1.append(line[0])
        column_2.append(line[1])
        column_3.append(line[2])
        diag_1.append(line[ind])
        diag_2.append(line[-1 - ind])
        if "-" in line:
            empty_val = True

    if x_win in (
        column_1,
        column_2,
        column_3,
        diag_1,
        diag_2,
        board[0],
        board[1],
        board[2],
    ):
        return "x wins!"
    elif o_win in (
        column_1,
        column_2,
        column_3,
        diag_1,
        diag_2,
        board[0],
        board[1],
        board[2],
    ):
        return "o wins!"
    elif empty_val:
        return "unfinished!"
    else:
        return "draw!"
