import React, { useState, useEffect } from 'react';
import { BarChart, X } from 'lucide-react';

const StatsButton = ({ stats }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Handle ESC key
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="absolute top-4 left-4 p-2 rounded-lg hover:bg-gray-700 transition-colors"
        aria-label="View Statistics"
      >
        <BarChart className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
          
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-gray-800 text-white rounded-lg p-6 max-w-md w-full shadow-xl">
              {/* Close button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-700 transition-colors"
                aria-label="Close Statistics"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-xl font-bold text-center mb-4">Statistics</h2>
              
              <div className="grid grid-cols-2 gap-6 mx-auto">
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
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StatsButton;