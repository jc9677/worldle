import { useState, useEffect } from 'react';

const useStats = () => {
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('wordleStats');
    return saved ? JSON.parse(saved) : {
      gamesPlayed: 0,
      gamesWon: 0,
      currentStreak: 0,
      maxStreak: 0,
      lastPlayed: null,
    };
  });

  useEffect(() => {
    localStorage.setItem('wordleStats', JSON.stringify(stats));
  }, [stats]);

  const updateStats = (won) => {
    const newStats = {
      ...stats,
      gamesPlayed: stats.gamesPlayed + 1,
      gamesWon: stats.gamesWon + (won ? 1 : 0),
      currentStreak: won ? stats.currentStreak + 1 : 0,
      maxStreak: won ? Math.max(stats.currentStreak + 1, stats.maxStreak) : stats.maxStreak,
      lastPlayed: new Date().toISOString(),
    };
    setStats(newStats);
  };

  return {
    stats,
    updateStats,
  };
};

export default useStats;
