#!/usr/bin/env python3
"""Generate a filtered list of 5-letter words suitable for Wordle."""

import re
import json
from pathlib import Path

def load_word_list():
    """Load words from Unix words file."""
    with open('/usr/share/dict/words', 'r') as f:
        return set(word.strip().lower() for word in f)

def filter_words(words):
    """Filter words based on Wordle criteria."""
    return {
        word for word in words
        if len(word) == 5
        and word.isalpha()  # only letters
        and word.islower()  # no proper nouns
        and not word.endswith('s')  # no plurals
        and not any(c not in 'abcdefghijklmnopqrstuvwxyz' for c in word)  # no special chars
    }

def write_js_module(words, output_path):
    """Write filtered words as a JavaScript module."""
    words_list = sorted(list(words))
    js_content = f"export const WORDS = {json.dumps(words_list, indent=2)};\n"
    
    with open(output_path, 'w') as f:
        f.write(js_content)

def main():
    all_words = load_word_list()
    filtered_words = filter_words(all_words)
    
    # Create output directory if it doesn't exist
    output_dir = Path(__file__).parent.parent / 'src' / 'constants'
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Write the filtered words to the JavaScript module
    output_path = output_dir / 'words.js'
    write_js_module(filtered_words, output_path)
    print(f"Generated {len(filtered_words)} words in {output_path}")

if __name__ == '__main__':
    main()
