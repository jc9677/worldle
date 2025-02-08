import React from 'react';
import Board from './components/Board';
import Keyboard from './components/Keyboard';
import GameOver from './components/GameOver';
import Stats from './components/Stats';
import useGameState from './hooks/useGameState';
import useStats from './hooks/useStats';
import { WORDS } from './constants/words';
import { KEYBOARD_LAYOUT } from './constants/keyboardLayout';
import { getTodaysWord, handleInput, getTileClass, getKeyClass, handleShare } from './utils/gameLogic';

function App() {
  const { state, handleInput, getTileClass } = useGameState();
  const { stats, updateStats } = useStats();

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <h1 className="text-4xl font-bold text-center mb-8">W🌎RLDle</h1>
      
      <Board board={state.board} getTileClass={getTileClass} />

      <Keyboard handleInput={handleInput} letterStates={state.letterStates} />

      {state.gameOver && (
        <GameOver
          won={state.won}
          targetWord={state.targetWord}
          handleShare={() => handleShare(state)}
          stats={stats}
        />
      )}

      <Stats stats={stats} />
    </div>
  );
}

export default App;
