export const getTodaysWord = () => {
  const today = new Date();
  const index = (today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()) % WORDS.length;
  return WORDS[index];
};

export const handleInput = (key, state, setState, stats, setStats) => {
  if (state.gameOver) return;

  if (key === 'ENTER') {
    if (state.currentCol === 5) {
      const guess = state.board[state.currentRow].join('');
      if (!WORDS.includes(guess)) {
        alert('Not in word list!');
        return;
      }

      const newLetterStates = { ...state.letterStates };
      const targetWord = state.targetWord;

      for (let i = 0; i < 5; i++) {
        const letter = guess[i];
        if (letter === targetWord[i]) {
          newLetterStates[letter] = 'correct';
        } else if (targetWord.includes(letter)) {
          if (newLetterStates[letter] !== 'correct') {
            newLetterStates[letter] = 'present';
          }
        } else {
          if (!newLetterStates[letter]) {
            newLetterStates[letter] = 'absent';
          }
        }
      }

      const won = guess === targetWord;
      const gameOver = won || state.currentRow === 5;

      if (gameOver) {
        const newStats = {
          ...stats,
          gamesPlayed: stats.gamesPlayed + 1,
          gamesWon: stats.gamesWon + (won ? 1 : 0),
          currentStreak: won ? stats.currentStreak + 1 : 0,
          maxStreak: won ? Math.max(stats.currentStreak + 1, stats.maxStreak) : stats.maxStreak,
          lastPlayed: new Date().toISOString(),
        };
        setStats(newStats);
      }

      setState({
        ...state,
        currentRow: state.currentRow + 1,
        currentCol: 0,
        letterStates: newLetterStates,
        gameOver,
        won,
      });
    }
  } else if (key === 'BACKSPACE') {
    if (state.currentCol > 0) {
      const newBoard = [...state.board];
      newBoard[state.currentRow][state.currentCol - 1] = '';
      setState({
        ...state,
        board: newBoard,
        currentCol: state.currentCol - 1,
      });
    }
  } else if (state.currentCol < 5) {
    const newBoard = [...state.board];
    newBoard[state.currentRow][state.currentCol] = key;
    setState({
      ...state,
      board: newBoard,
      currentCol: state.currentCol + 1,
    });
  }
};

export const getTileClass = (row, col, state) => {
  const baseClass = 'tile';
  if (row >= state.currentRow) return baseClass;

  const letter = state.board[row][col];
  if (letter === state.targetWord[col]) return `${baseClass} correct`;
  if (state.targetWord.includes(letter)) return `${baseClass} present`;
  return `${baseClass} absent`;
};

export const getKeyClass = (key, state) => {
  const baseClass = key.length > 1 ? 'key wide' : 'key';
  return `${baseClass} ${state.letterStates[key] || ''}`;
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
