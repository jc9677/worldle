import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { submitToForm } from '../utils/formSubmission';

const GameOver = ({ 
  won, 
  targetWord, 
  handleShare, 
  stats, 
  currentRow, 
  state, 
  setState,
  onFormSubmitted 
}) => {
  const [shareText, setShareText] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [submitStatus, setSubmitStatus] = useState('');

  // Generate share text once when component mounts
  useEffect(() => {
    const generateShareText = async () => {
      try {
        const mockClipboard = {
          writeText: (text) => {
            setShareText(text);
            return Promise.resolve();
          }
        };
        await handleShare(mockClipboard);
      } catch (error) {
        console.error('Error generating share text:', error);
        setShareText(`${won ? `Won in ${currentRow}` : 'Lost'}`);
      }
    };

    generateShareText();
  }, [won, currentRow, handleShare]);

  // Handle form submission when shareText is available
  useEffect(() => {
    if (!shareText) return;

    // Check if we've already submitted successfully
    if (state?.submissionStatus === 'success') {
      console.log('Already submitted successfully, skipping...');
      setSubmitStatus('success');
      return;
    }

    const submitResult = async () => {
      const webhookUrl = localStorage.getItem('worldle_webhook_url');
      if (!webhookUrl) return;

      setSubmitStatus('submitting');
      try {
        const success = await submitToForm(shareText, state, setState);
        setSubmitStatus(success ? 'success' : 'error');
        if (success && onFormSubmitted) {
          onFormSubmitted(); // Trigger refresh of PlayerResults
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        setSubmitStatus('error');
      }
    };

    submitResult();
  }, [shareText, state?.submissionStatus, onFormSubmitted]);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        setIsVisible(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

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

        {/* <div className="flex justify-center">
          <button
            onClick={handlePlayAgain}
            disabled={isSubmitting}
            className={`font-bold py-2 px-4 rounded ${
              isSubmitting 
                ? 'bg-gray-500 cursor-not-allowed opacity-50' 
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            {isSubmitting ? 'Submitting...' : 'Play Again'}
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default GameOver;