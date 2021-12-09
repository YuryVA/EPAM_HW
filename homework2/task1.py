"""
Given a file containing text. Complete using only default collections:
    1) Find 10 longest words consisting from largest amount of unique symbols
    2) Find rarest symbol for document
    3) Count every punctuation char
    4) Count every non ascii char
    5) Find most common non ascii char for document
"""
import codecs
from typing import List


def tokenize_file(file_path):

    text_no_line_break = ""
    words = {}
    symbols = {}
    punctuation = {}

    with open(file_path) as file:
        text = file.readlines()
        for line in text:
            line = codecs.decode(line, "unicode_escape")
            if line.endswith("-\n"):
                text_no_line_break += line.rstrip("-\n")
            else:
                text_no_line_break += line

            for symbol in line.rstrip():
                if symbol != " " and not symbol.isalnum():
                    punctuation[symbol] = punctuation.get(symbol, 0) + 1
                elif symbol != " ":
                    symbols[symbol] = symbols.get(symbol, 0) + 1

    for item in text_no_line_break.split():
        item = item.rstrip()
        if item and item.isalpha():
            words[item] = words.get(item, 0) + 1
        elif item and not item[0].isalnum():
            words[item[1:]] = words.get(item[1:], 0) + 1
        elif item and not item[-1].isalnum():
            words[item[:-1]] = words.get(item[:-1], 0) + 1

    return words, symbols, punctuation


def get_longest_diverse_words(file_path: str) -> List[str]:
    """Find 10 longest words consisting from largest amount of unique symbols"""

    unique_symb_in_word_dct = {}
    for word in tokenize_file(file_path)[0]:
        unique_symb_in_word_dct[word] = len(set(word))
    longest_words = [
        i[0]
        for i in sorted(
            unique_symb_in_word_dct.items(), key=lambda x: x[1], reverse=True
        )[:10]
    ]
    return longest_words


def get_rarest_char(file_path: str) -> str:
    """Find rarest symbol for document"""

    rarest_chars = [
        i[0]
        for i in sorted(tokenize_file(file_path)[1].items(), key=lambda x: x[1])
        if i[1] < 2
    ]
    return ", ".join(rarest_chars)


def count_punctuation_chars(file_path: str) -> int:
    """Count every punctuation char"""

    count_all_punct_char = sum(i[1] for i in tokenize_file(file_path)[2].items())
    return count_all_punct_char


def count_non_ascii_chars(file_path: str) -> int:
    """Count every non ascii char"""

    non_ascii_count = sum(
        i[1]
        for i in tokenize_file(file_path)[1].items()
        if len(i[0].encode(encoding="utf8")) > 1
    )
    return non_ascii_count


def get_most_common_non_ascii_char(file_path: str) -> str:
    """Find most common non ascii char for document"""

    most_com_non_ascii_chars = [
        i[0]
        for i in sorted(
            tokenize_file(file_path)[1].items(), key=lambda x: x[1], reverse=True
        )
        if len(i[0].encode(encoding="utf8")) > 1
    ]
    return most_com_non_ascii_chars[0]
