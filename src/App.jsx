import React from 'react';
import Board from './components/Board';
import Keyboard from './components/Keyboard';
import GameOver from './components/GameOver';
import Stats from './components/Stats';
import useGameState from './hooks/useGameState';
import useStats from './hooks/useStats';
import { handleShare } from './utils/gameLogic';

function App() {
  const { state, setState, handleInput } = useGameState();
  const { stats, updateStats } = useStats();

  const getTileClass = (row, col) => {
    if (row >= state.currentRow) return '';
    
    const letter = state.board[row][col];
    if (letter === state.targetWord[col]) return 'bg-green-600';
    if (state.targetWord.includes(letter)) return 'bg-yellow-600';
    return 'bg-gray-700';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-lg">
        <h1 className="text-4xl font-bold text-center mb-8">W🌎RLDle</h1>
        
        <Board 
          board={state.board} 
          getTileClass={getTileClass} 
        />

        <Keyboard 
          handleInput={handleInput} 
          letterStates={state.letterStates} 
        />

        {state.gameOver && (
          <GameOver
            won={state.won}
            targetWord={state.targetWord}
            handleShare={() => handleShare(state)}
            stats={stats}
            currentRow={state.currentRow}
          />
        )}

        {/* <Stats stats={stats} /> */}
      </div>
    </div>
  );
}

export default App;
