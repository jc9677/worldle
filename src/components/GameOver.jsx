import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { submitToForm } from '../utils/formSubmission';

const GameOver = ({ won, targetWord, handleShare, stats, currentRow }) => {
  // State to store the share text
  const [shareText, setShareText] = useState('');

  // Function to get share text without copying to clipboard
  const getShareText = () => {
    // Create a mock clipboard function
    const mockClipboard = (text) => {
      setShareText(text);
      return Promise.resolve();
    };

    // If navigator.clipboard is available, temporarily replace it
    if (navigator.clipboard && navigator.clipboard.writeText) {
      const originalClipboard = navigator.clipboard.writeText;
      navigator.clipboard.writeText = mockClipboard;
      handleShare();
      navigator.clipboard.writeText = originalClipboard;
    } else {
      // If clipboard API is not available, just call handleShare with mock
      const originalClipboard = window.navigator.clipboard;
      window.navigator.clipboard = { writeText: mockClipboard };
      handleShare();
      window.navigator.clipboard = originalClipboard;
    }

    return shareText;
  };
  const [isVisible, setIsVisible] = useState(true);
  const [submitStatus, setSubmitStatus] = useState('');

  // Get share text and submit to form when component mounts
  useEffect(() => {
    getShareText();
  }, []);

  // Submit to form when we have the share text
  useEffect(() => {
    const autoSubmit = async () => {
      if (shareText && localStorage.getItem('worldle_form_url')) {
        setSubmitStatus('submitting');
        try {
          const success = await submitToForm(shareText);
          setSubmitStatus(success ? 'success' : 'error');
          setTimeout(() => setSubmitStatus(''), 3000);
        } catch (error) {
          setSubmitStatus('error');
          setTimeout(() => setSubmitStatus(''), 3000);
        }
      }
    };
    autoSubmit();
  }, [shareText]);

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

  const handleShareClick = async () => {
    // Copy to clipboard
    try {
      await navigator.clipboard.writeText(shareText);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      // Fallback for mobile browsers
      const textarea = document.createElement('textarea');
      textarea.value = shareText;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        textarea.remove();
      } catch (err) {
        console.error('Fallback clipboard copy failed:', err);
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
            onClick={handleShareClick}
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