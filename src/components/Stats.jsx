import React from 'react';

const Stats = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 gap-6 mt-8 max-w-sm mx-auto">
      <div className="text-center">
        <div className="text-3xl font-bold">{stats?.gamesPlayed || 0}</div>
        <div className="text-sm uppercase tracking-wide">Played</div>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold">
          {stats?.gamesPlayed ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0}%
        </div>
        <div className="text-sm uppercase tracking-wide">Win Rate</div>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold">{stats?.currentStreak || 0}</div>
        <div className="text-sm uppercase tracking-wide">Current Streak</div>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold">{stats?.maxStreak || 0}</div>
        <div className="text-sm uppercase tracking-wide">Max Streak</div>
      </div>
    </div>
  );
};

export default Stats;