import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { submitToForm } from '../utils/formSubmission';

const GameOver = ({ won, targetWord, handleShare, stats, currentRow }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [submitStatus, setSubmitStatus] = useState('');

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
    localStorage.removeItem('wordleState');
    window.location.reload();
  };

  const handleShareAndSubmit = async () => {
    // Get the share text by temporarily replacing navigator.clipboard.writeText
    let shareText = '';
    const originalClipboard = navigator.clipboard.writeText;
    navigator.clipboard.writeText = (text) => {
      shareText = text;
      return Promise.resolve();
    };

    // Call handleShare to get the text
    handleShare();

    // Restore original clipboard function
    navigator.clipboard.writeText = originalClipboard;

    // Now copy to actual clipboard
    try {
      await navigator.clipboard.writeText(shareText);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }

    // Submit to form if configured
    if (localStorage.getItem('worldle_form_url')) {
      setSubmitStatus('submitting');
      try {
        const success = await submitToForm(shareText);
        setSubmitStatus(success ? 'success' : 'error');
        
        // Clear status after 3 seconds
        setTimeout(() => setSubmitStatus(''), 3000);
      } catch (error) {
        setSubmitStatus('error');
        setTimeout(() => setSubmitStatus(''), 3000);
      }
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0" 
        onClick={() => setIsVisible(false)} 
      />
      
      <div className="relative bg-gray-800 p-6 rounded-lg shadow-xl max-w-sm w-full border border-yellow-500 mx-auto" style={{ position: 'fixed', top: '35%', left: '50%', transform: 'translate(-50%, -50%)' }}>
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
          
          {submitStatus && (
            <p className={`mt-2 text-sm ${
              submitStatus === 'success' ? 'text-green-400' : 
              submitStatus === 'error' ? 'text-red-400' : 
              'text-gray-400'
            }`}>
              {submitStatus === 'submitting' ? 'Submitting result...' :
               submitStatus === 'success' ? 'Result submitted!' :
               submitStatus === 'error' ? 'Failed to submit result' : ''}
            </p>
          )}
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={handleShareAndSubmit}
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