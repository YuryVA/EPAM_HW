from pathlib import Path
from typing import Callable, Optional


def universal_file_counter(
    dir_path: Path, file_extension: str, tokenizer: Optional[Callable] = None
) -> int:
    """
    Count lines in all files with given extension on given path if there are no tokenizer.
    If a the tokenizer is not none, it will count tokens.
    """

    num_lines, num_tokens = 0, 0

    p = Path(dir_path)
    file_list = list(p.glob(f"*.{file_extension}"))

    for file_name in file_list:
        with open(file_name) as f:
            for line in f:
                num_lines += 1
                if tokenizer:
                    num_tokens += len(tokenizer(line))

    if tokenizer:
        return num_tokens
    return num_lines
