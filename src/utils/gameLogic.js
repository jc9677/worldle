import { SOLUTION_WORDS } from '../constants/solution_words';

// Load valid guesses from file
async function loadValidGuesses() {
  try {
    console.log('Loading valid guesses...');
    const response = await fetch('/worldle/5-letter-words.csv');
    const text = await response.text();
    // Split by newlines and filter out empty strings
    const words = text.split('\n')
      .map(word => word.trim().toUpperCase())
      .filter(word => word.length > 0);
    console.log('Loaded words:', words.length);
    return words;
  } catch (error) {
    console.error('Error loading valid guesses:', error);
    return [];
  }
}

export const getTodaysWord = () => {
  // Get SOLUTION_WORDS.length
  console.log('Number of solution words:', SOLUTION_WORDS.length);
  const today = new Date();
  const index = (today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()) % SOLUTION_WORDS.length;
  // Get the word for today and convert to uppercase
  console.log('Today\'s index:', index);
  const word = SOLUTION_WORDS[index];
  console.log('Today\'s word:', word);
  // Convert to uppercase
  const uppercaseWord = word.toUpperCase();

  return uppercaseWord;
};

// Cache for valid guesses
let validGuessesCache = null;

export const isValidGuess = async (guess) => {
  console.log('Checking if valid guess:', guess);
  // First time loading valid guesses
  if (!validGuessesCache) {
    validGuessesCache = await loadValidGuesses();
  }
  //console.log('Valid guesses cache:', validGuessesCache);
  
  const isValid = SOLUTION_WORDS.includes(guess) || validGuessesCache.includes(guess);
  console.log('Is valid?', isValid);
  return isValid;
};

export const handleShare = (state, customClipboard = navigator.clipboard) => {
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

  return customClipboard.writeText(result);
};

export const getRandomWord = () => {
  const randomIndex = Math.floor(Math.random() * SOLUTION_WORDS.length);
  return SOLUTION_WORDS[randomIndex];
};
