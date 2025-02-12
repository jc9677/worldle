import { useState, useEffect } from 'react';
import { getTodaysWord, isValidGuess } from '../utils/gameLogic';
import { SOLUTION_WORDS } from '../constants/solution_words';

const useGameState = () => {
  const [state, setState] = useState(() => {
    const saved = localStorage.getItem('wordleState');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.targetWord !== getTodaysWord()) {
        return {
          board: Array(6).fill().map(() => Array(6).fill('')),
          currentRow: 0,
          currentCol: 0,
          gameOver: false,
          won: false,
          targetWord: getTodaysWord(),
          letterStates: {},
          submissionStatus: null, // Reset submission status for new word
          isAdditionalGame: false // Initialize flag for main game
        };
      }
      return parsed;
    }
    return {
      board: Array(6).fill().map(() => Array(6).fill('')),
      currentRow: 0,
      currentCol: 0,
      gameOver: false,
      won: false,
      targetWord: getTodaysWord(),
      letterStates: {},
      submissionStatus: null, // Initialize submission status
      isAdditionalGame: false // Initialize flag for main game
    };
  });

  const [previousTodaysWord, setPreviousTodaysWord] = useState(getTodaysWord());

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

  useEffect(() => {
    const todaysWord = getTodaysWord();
    if (todaysWord !== previousTodaysWord) {
      setPreviousTodaysWord(todaysWord);
      setState((prevState) => ({
        ...prevState,
        isAdditionalGame: false
      }));
    }
  }, [previousTodaysWord]);

  const processGuess = (guess, targetWord) => {
    const colors = Array(6).fill('bg-gray-700');
    const letterCounts = {};
    const newLetterStates = {};
    
    // Count target word letters
    for (const letter of targetWord) {
      letterCounts[letter] = (letterCounts[letter] || 0) + 1;
    }
  
    // Mark greens first
    for (let i = 0; i < 6; i++) {
      if (guess[i] === targetWord[i]) {
        colors[i] = 'bg-green-600';
        letterCounts[guess[i]]--;
      }
    }
  
    // Then yellows, only if letters remain
    for (let i = 0; i < 6; i++) {
      if (colors[i] === 'bg-gray-700' && letterCounts[guess[i]] > 0) {
        colors[i] = 'bg-yellow-600';
        letterCounts[guess[i]]--;
      }
    }
    // Update letter states based on final colors
    for (let i = 0; i < 6; i++) {
      const letter = guess[i];
      const color = colors[i];
      if (!newLetterStates[letter] || 
          (color === 'bg-green-600') || 
          (color === 'bg-yellow-600' && newLetterStates[letter] !== 'bg-green-600')) {
        newLetterStates[letter] = color;
      }
    }

    console.log('Colors:', colors);
    return { tileColors: colors, newLetterStates };
  };

  const handleInput = async (key) => {
    if (state.gameOver) return;
  
    if (key === 'ENTER') {
      console.log('Enter pressed');
      if (state.currentCol === 6) {
        const guess = state.board[state.currentRow].join('');
        if (!await isValidGuess(guess)) {
          alert('Not in word list!');
          return;
        }
  
        const { tileColors, newLetterStates } = processGuess(guess, state.targetWord);

        console.log('tileColors:', tileColors);
        console.log('newLetterStates:', newLetterStates);
        
        setState({
          ...state,
          currentRow: state.currentRow + 1,
          currentCol: 0,
          letterStates: { ...state.letterStates, ...newLetterStates },
          tileColors: [...state.tileColors || [], tileColors],
          gameOver: guess === state.targetWord || state.currentRow === 5,
          won: guess === state.targetWord,
          submissionStatus: null // Reset submission status when game ends
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
    } else if (state.currentCol < 6) {
      const newBoard = [...state.board];
      newBoard[state.currentRow][state.currentCol] = key;
      setState({
        ...state,
        board: newBoard,
        currentCol: state.currentCol + 1,
      });
    }
  };

  const resetGameState = (randomWord, isAdditionalGame = false) => {
    const todaysWord = getTodaysWord();
    const shouldResetAdditionalGame = todaysWord !== previousTodaysWord;
  
    setState({
      board: Array(6).fill().map(() => Array(6).fill('')),
      currentRow: 0,
      currentCol: 0,
      gameOver: false,
      won: false,
      targetWord: randomWord,
      letterStates: {},
      submissionStatus: null,
      isAdditionalGame: isAdditionalGame  // Always use the passed value
    });
  
    if (shouldResetAdditionalGame) {
      setPreviousTodaysWord(todaysWord);
    }
  };

  const getRandomWord = () => {
    const randomIndex = Math.floor(Math.random() * SOLUTION_WORDS.length);
    return SOLUTION_WORDS[randomIndex];
  };

  return {
    state,
    setState, // Export setState to allow updating submission status
    handleInput,
    resetGameState,
    getRandomWord
  };
};

export default useGameState;
