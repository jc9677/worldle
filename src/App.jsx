import React, { useEffect, useState } from 'react';
import Board from './components/Board';
import Keyboard from './components/Keyboard';
import GameOver from './components/GameOver';
import StatsButton from './components/StatsButton';
import FormSettings from './components/FormSettings';
import PlayerResults from './components/PlayerResults';
import DebugLog from './components/DebugLog';
import useGameState from './hooks/useGameState';
import useStats from './hooks/useStats';
import { handleShare, getRandomWord } from './utils/gameLogic';

function App() {
  const { state, setState, handleInput, resetGameState } = useGameState();
  const { stats, updateStats } = useStats();
  const [showSettings, setShowSettings] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    if (state.gameOver) {
      updateStats(state.won);
    }
  }, [state.gameOver, state.won]);

  const handleFormSubmitted = () => {
    setRefreshTrigger(prev => prev + 1); // Increment to trigger refresh
  };

  const handlePlayAgain = () => {
    const randomWord = getRandomWord();
    resetGameState(randomWord);
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
          tileColors={state.tileColors}
        />

        <Keyboard 
          handleInput={handleInput} 
          letterStates={state.letterStates} 
        />

        <PlayerResults refreshTrigger={refreshTrigger} />

        {state.gameOver && (
          <GameOver
            won={state.won}
            targetWord={state.targetWord}
            handleShare={async (clipboard) => handleShare(state, clipboard)}
            stats={stats}
            currentRow={state.currentRow}
            state={state}
            setState={setState}
            onFormSubmitted={handleFormSubmitted}
            onPlayAgain={handlePlayAgain}
          />
        )}

        <FormSettings
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
        />

        {/* <DebugLog /> */}
      </div>
    </div>
  );
}

export default App;
