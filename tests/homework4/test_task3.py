from homework4.task3 import my_precious_logger


def test_my_precious_logger(capsys):
    result = my_precious_logger("error")
    captured = capsys.readouterr()
    assert captured.err == "error"
    result = my_precious_logger("OK")
    captured = capsys.readouterr()
    assert captured.out == "OK"
