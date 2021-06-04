from homework2.task1 import get_longest_diverse_words


def test_get_longest_diverse_words():
    assert get_longest_diverse_words("homework2/data.txt") == [
        "Souveränitätsansprüche",
        "unmißverständliche",
        "Bevölkerungsabschub",
        "symbolischsakramentale",
        "Kollektivschuldiger",
        "unverhältnismäßig",
        "Werkstättenlandschaft",
        "Schicksalsfiguren",
        "Selbstverständlich",
        "Verwaltungsmaßnahme",
    ]
