import React from 'react';

const GameOver = ({ won, targetWord, handleShare, stats }) => {
  return (
    <div className="mt-8 text-center">
      <p className="text-xl mb-4">
        {won ? 'Congratulations!' : `The word was: ${targetWord}`}
      </p>
      <button
        className="bg-green-600 text-white px-6 py-2 rounded-lg mb-6"
        onClick={handleShare}
      >
        Share Results
      </button>
      <div className="stats">
        <div className="stat-item">
          <div className="stat-value">{stats.gamesPlayed}</div>
          <div className="stat-label">Played</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">
            {Math.round((stats.gamesWon / stats.gamesPlayed) * 100) || 0}%
          </div>
          <div className="stat-label">Win Rate</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{stats.currentStreak}</div>
          <div className="stat-label">Current Streak</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{stats.maxStreak}</div>
          <div className="stat-label">Max Streak</div>
        </div>
      </div>
    </div>
  );
};

export default GameOver;
