import React, { useEffect, useState } from 'react';
import Board from './Board';
import Keyboard from './Keyboard';
import GameOver from './GameOver';
import StatsButton from './StatsButton';
import FormSettings from './FormSettings';
import PlayerResults from './PlayerResults';
import useGameState from '../hooks/useGameState';
import useStats from '../hooks/useStats';
import { Settings } from 'lucide-react';

function App() {
  const { state, setState, handleInput } = useGameState();
  const { stats, updateStats } = useStats();
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (state.gameOver) {
      updateStats(state.won);
    }
  }, [state.gameOver, state.won]);

  const getTileClass = (row, col) => {
    if (row >= state.currentRow) return '';
    
    const letter = state.board[row][col];
    if (letter === state.targetWord[col]) return 'bg-green-600';
    if (state.targetWord.includes(letter)) return 'bg-yellow-600';
    return 'bg-gray-700';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-1 py-3 max-w-lg relative">
        <div className="flex justify-between items-center mb-8">
          <StatsButton stats={stats} />
          <h1 className="text-2xl font-bold text-center">W🌎RLDle</h1>
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
            aria-label="Settings"
          >
            <Settings className="w-6 h-6" />
          </button>
        </div>
        
        <Board 
          board={state.board} 
          getTileClass={getTileClass} 
        />

        <Keyboard 
          handleInput={handleInput} 
          letterStates={state.letterStates} 
        />

        <PlayerResults />

        {state.gameOver && (
          <GameOver
            won={state.won}
            targetWord={state.targetWord}
            stats={stats}
            currentRow={state.currentRow}
            board={state.board}
          />
        )}

        <FormSettings
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
        />
      </div>
    </div>
  );
}

export default App;