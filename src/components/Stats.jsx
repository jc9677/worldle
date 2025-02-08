import React from 'react';

const Stats = ({ stats }) => {
  return (
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
  );
};

export default Stats;
