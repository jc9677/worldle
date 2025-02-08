import React from 'react';

const GameOver = ({ won, targetWord, handleShare, stats }) => {
  const handlePlayAgain = () => {
    localStorage.removeItem('wordleState');
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-sm w-full">
        <h2 className="text-2xl font-bold text-center mb-4">
          {won ? 'Congratulations!' : 'Game Over'}
        </h2>
        
        <p className="text-center mb-4">
          {won 
            ? `You found today's word in ${stats.currentStreak} guesses!` 
            : `The word was: ${targetWord}`
          }
        </p>

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