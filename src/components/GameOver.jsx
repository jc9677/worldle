import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const GameOver = ({ won, targetWord, handleShare, stats, currentRow }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        setIsVisible(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const handlePlayAgain = () => {
    // Only clear the game state, keep the stats
    localStorage.removeItem('wordleState');
    window.location.reload();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0" 
        onClick={() => setIsVisible(false)} 
      />
      
      <div className="relative bg-gray-800 p-6 rounded-lg shadow-xl max-w-sm w-full">
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-700 transition-colors"
          aria-label="Close Dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-center mb-4">
          {won ? 'Congratulations!' : 'Game Over'}
        </h2>
        
        <div className="text-center mb-6">
          <p className="mb-2">
            {won 
              ? `You found the word in ${currentRow} guesses!` 
              : `The word was: ${targetWord}`
            }
          </p>
          <p className="text-sm text-gray-400">
            Games Won: {stats.gamesWon} / {stats.gamesPlayed}
            <br />
            Current Streak: {stats.currentStreak}
            <br />
            Max Streak: {stats.maxStreak}
          </p>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={handleShare}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Share Results
          </button>
          
          <button
            onClick={handlePlayAgain}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOver;