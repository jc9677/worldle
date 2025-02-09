import { useState, useEffect } from 'react';
import { getTodaysWord, isValidGuess } from '../utils/gameLogic';

const useGameState = () => {
  const [state, setState] = useState(() => {
    const saved = localStorage.getItem('wordleState');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.targetWord !== getTodaysWord()) {
        return {
          board: Array(6).fill().map(() => Array(5).fill('')),
          currentRow: 0,
          currentCol: 0,
          gameOver: false,
          won: false,
          targetWord: getTodaysWord(),
          letterStates: {},
        };
      }
      return parsed;
    }
    return {
      board: Array(6).fill().map(() => Array(5).fill('')),
      currentRow: 0,
      currentCol: 0,
      gameOver: false,
      won: false,
      targetWord: getTodaysWord(),
      letterStates: {},
    };
  });

  useEffect(() => {
    localStorage.setItem('wordleState', JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        handleInput('ENTER');
      } else if (e.key === 'Backspace') {
        handleInput('BACKSPACE');
      } else if (/^[A-Za-z]$/.test(e.key)) {
        handleInput(e.key.toUpperCase());
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state]);

  const handleInput = async (key) => {
    if (state.gameOver) return;

    if (key === 'ENTER') {
      if (state.currentCol === 5) {
        const guess = state.board[state.currentRow].join('');
        const isValid = await isValidGuess(guess);
        
        if (!isValid) {
          alert('Not in word list!');
          return;
        }

        const newLetterStates = { ...state.letterStates };
        const targetWord = state.targetWord;

        for (let i = 0; i < 5; i++) {
          const letter = guess[i];
          if (letter === targetWord[i]) {
            newLetterStates[letter] = 'bg-green-600';
          } else if (targetWord.includes(letter)) {
            if (newLetterStates[letter] !== 'bg-green-600') {
              newLetterStates[letter] = 'bg-yellow-600';
            }
          } else {
            if (!targetWord.includes(letter) && !newLetterStates[letter]) {
              newLetterStates[letter] = 'bg-gray-700';
            }
          }
        }

        const won = guess === targetWord;
        const gameOver = won || state.currentRow === 5;

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

  const getTileClass = (row, col) => {
    const baseClass = 'tile';
    if (row >= state.currentRow) return baseClass;

    const letter = state.board[row][col];
    if (letter === state.targetWord[col]) return `${baseClass} correct`;
    if (state.targetWord.includes(letter)) return `${baseClass} present`;
    return `${baseClass} absent`;
  };

  return {
    state,
    handleInput,
    getTileClass,
  };
};

export default useGameState;
