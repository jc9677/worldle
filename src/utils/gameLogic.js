import { WORDS } from '../constants/words';

export const getTodaysWord = () => {
  const today = new Date();
  const index = (today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()) % WORDS.length;
  return WORDS[index];
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