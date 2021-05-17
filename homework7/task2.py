def backspace_compare(first: str, second: str):
    """
    Return if two given strings are equal when both are typed into
    empty text editors.
    # means a backspace character.
    """

    def clear_str(string):
        char_list = []
        for symbol in string:
            if char_list and symbol == "#":
                char_list.pop()
            elif symbol != "#":
                char_list.append(symbol)
        return "".join(char_list)

    clear_first = clear_str(first)
    clear_second = clear_str(second)

    return clear_first == clear_second
