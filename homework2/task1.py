"""
Given a file containing text. Complete using only default collections:
    1) Find 10 longest words consisting from largest amount of unique symbols
    2) Find rarest symbol for document
    3) Count every punctuation char
    4) Count every non ascii char
    5) Find most common non ascii char for document
"""
from typing import List
import codecs

def get_longest_diverse_words(file_path: str) -> List[str]:
    """Find 10 longest words consisting from largest amount of unique symbols"""

    unique_symb_in_word_dct = {}
    temp_list = []
    longest_words = []
    with open(file_path) as file:
        for line in file:
            for word in line.split():
                if not word[-1].isalnum():
                    word = word[:-1]
                    unique_symb_in_word_dct[word] = unique_symb_in_word_dct.get(
                        word, len(set(word))
                    )
    temp_list = sorted(
        unique_symb_in_word_dct.items(), key=lambda x: x[1], reverse=True
    )[:10]
    for pair in temp_list:
        longest_words.append(codecs.decode(pair[0], 'unicode_escape'))
    return longest_words


def get_rarest_char(file_path: str) -> str:
    """Find rarest symbol for document"""

    unique_symb_dct = {}
    rarest_chars = ""
    with open(file_path) as file:
        for line in file:
            for symbol in codecs.decode(line, "unicode_escape"):
                unique_symb_dct[symbol] = unique_symb_dct.get(symbol, 0) + 1
    for pair in sorted(unique_symb_dct.items(), key=lambda x: x[1]):
        if pair[1] == 1:
            rarest_chars += pair[0]
    return ", ".join(rarest_chars)


def count_punctuation_chars(file_path: str) -> int:
    """Count every punctuation char"""

    punct_count_dct = {}
    count_all_punct_char = 0
    with open(file_path) as file:
        for line in file:
            for word in line.split():
                if not word[-1].isalnum():
                    punct_count_dct[word[-1]] = punct_count_dct.get(word[-1], 0) + 1
    for value in punct_count_dct.values():
        count_all_punct_char += value
    return count_all_punct_char


def count_non_ascii_chars(file_path: str) -> int:
    """Count every non ascii char"""

    non_ascii_count = 0
    with open(file_path) as file:
        for line in file:
            for word in line.split():
                if "\\u" in word:
                    non_ascii_count += 1
    return non_ascii_count


def get_most_common_non_ascii_char(file_path: str) -> str:
    """Find most common non ascii char for document"""

    most_com_ascii_count = {}
    with open(file_path) as file:
        for line in file:
            for word in line.split():
                if "\\u" in word:
                    ascii_symb = codecs.decode(word[word.find("\\u") : word.find("\\u") + 6], "unicode_escape")
                    most_com_ascii_count[ascii_symb] = (
                        most_com_ascii_count.get(ascii_symb, 0) + 1
                    )
    return sorted(most_com_ascii_count.items(), key=lambda x: x[1], reverse=True)[0][0]
