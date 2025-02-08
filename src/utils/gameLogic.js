import { SOLUTION_WORDS } from '../constants/solution_words';

// Load valid guesses from file
async function loadValidGuesses() {
  try {
    const response = await window.fs.readFile('src/constants/valid_guesses.txt', { encoding: 'utf8' });
    return response.split('\n').map(word => word.trim()).filter(word => word);
  } catch (error) {
    console.error('Error loading valid guesses:', error);
    return [];
  }
}

export const getTodaysWord = () => {
  const today = new Date();
  const index = (today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()) % SOLUTION_WORDS.length;
  return SOLUTION_WORDS[index];
};

// Cache for valid guesses
let validGuessesCache = null;

export const isValidGuess = async (guess) => {
  // First time loading valid guesses
  if (!validGuessesCache) {
    validGuessesCache = await loadValidGuesses();
  }
  
  // Check if word is in either list
  return SOLUTION_WORDS.includes(guess) || validGuessesCache.includes(guess);
};

export const handleShare = (state) => {
  if (!state.gameOver) return;

  let result = `Wordle Clone ${state.won ? state.currentRow : 'X'}/6\n\n`;
  for (let i = 0; i < state.currentRow; i++) {
    const row = state.board[i];
    for (let j = 0; j < 5; j++) {
      const letter = row[j];
      if (letter === state.targetWord[j]) {
        result += '🟩';
      } else if (state.targetWord.includes(letter)) {
        result += '🟨';
      } else {
        result += '⬛';
      }
    }
    result += '\n';
  }

  navigator.clipboard.writeText(result)
    .then(() => alert('Results copied to clipboard!'))
    .catch(() => alert('Failed to copy results'));
};