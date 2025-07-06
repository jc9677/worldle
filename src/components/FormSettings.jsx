import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { 
  validatePlayerName, 
  isValidGoogleFormUrl, 
  MAX_PLAYER_NAME_LENGTH,
  MAX_URL_LENGTH
} from '../utils/security.js';

const FormSettings = ({ isOpen, onClose }) => {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [sheetId, setSheetId] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [errors, setErrors] = useState({});
  const SEPARATOR = 'L4x,9hjH';
  
  useEffect(() => {
    const savedWebhookUrl = localStorage.getItem('worldle_webhook_url');
    const savedPlayerName = localStorage.getItem('worldle_player_name');
    const savedSheetId = localStorage.getItem('worldle_sheet_id');
    
    if (savedWebhookUrl) setWebhookUrl(savedWebhookUrl);
    if (savedPlayerName) setPlayerName(savedPlayerName);
    if (savedSheetId) setSheetId(savedSheetId);
  }, []);
  
  const handleAccessCodeChange = (e) => {
    const fullCode = e.target.value;
    
    // Limit input length
    if (fullCode.length > MAX_URL_LENGTH) {
      setErrors({ ...errors, accessCode: 'Access code is too long' });
      return;
    }
    
    if (fullCode.includes(SEPARATOR)) {
      const [webhookPart, sheetPart] = fullCode.split(SEPARATOR);
      setWebhookUrl(webhookPart);
      setSheetId(sheetPart);
    } else {
      // If no separator found, store everything in webhookUrl
      setWebhookUrl(fullCode);
      setSheetId('');
    }
    
    // Clear access code error when user types
    if (errors.accessCode) {
      setErrors({ ...errors, accessCode: null });
    }
  };

  const handlePlayerNameChange = (e) => {
    const name = e.target.value;
    
    // Limit input length
    if (name.length > MAX_PLAYER_NAME_LENGTH) {
      setErrors({ ...errors, playerName: 'Name is too long' });
      return;
    }
    
    setPlayerName(name);
    
    // Clear player name error when user types
    if (errors.playerName) {
      setErrors({ ...errors, playerName: null });
    }
  };

  const saveSettings = () => {
    const newErrors = {};
    
    // Validate player name
    const sanitizedPlayerName = validatePlayerName(playerName);
    if (!sanitizedPlayerName) {
      newErrors.playerName = 'Please enter a valid name (letters, numbers, and basic punctuation only)';
    }
    
    // Validate webhook URL
    if (webhookUrl && !isValidGoogleFormUrl(webhookUrl)) {
      newErrors.accessCode = 'Please enter a valid Google Forms URL';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Only save if validation passes
    localStorage.setItem('worldle_webhook_url', webhookUrl);
    localStorage.setItem('worldle_player_name', sanitizedPlayerName);
    localStorage.setItem('worldle_sheet_id', sheetId);
    setErrors({});
    onClose();
  };

  // Combine webhook and sheet ID for display in input
  const displayAccessCode = sheetId ? `${webhookUrl}${SEPARATOR}${sheetId}` : webhookUrl;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0" 
        onClick={onClose}
      />
      
      <div className="relative bg-gray-800 p-6 rounded-lg shadow-xl max-w-sm w-full border border-yellow-500 mx-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-700 transition-colors"
          aria-label="Close Dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-center mb-4">Share Settings</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Your Name</label>
            <input
              type="text"
              className={`w-full p-2 rounded bg-gray-700 border ${
                errors.playerName ? 'border-red-500' : 'border-gray-600'
              }`}
              value={playerName}
              onChange={handlePlayerNameChange}
              placeholder="Enter your name"
              maxLength={MAX_PLAYER_NAME_LENGTH}
            />
            {errors.playerName && (
              <p className="text-red-400 text-xs mt-1">{errors.playerName}</p>
            )}
            <p className="text-xs text-gray-400 mt-1">
              {playerName.length}/{MAX_PLAYER_NAME_LENGTH} characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Access code</label>
            <input
              type="text"
              className={`w-full p-2 rounded bg-gray-700 border ${
                errors.accessCode ? 'border-red-500' : 'border-gray-600'
              }`}
              value={displayAccessCode}
              onChange={handleAccessCodeChange}
              placeholder="<big long weird code goes here>"
              maxLength={MAX_URL_LENGTH}
            />
            {errors.accessCode && (
              <p className="text-red-400 text-xs mt-1">{errors.accessCode}</p>
            )}
            <p className="text-xs text-gray-400 mt-1">
              Enter the Google Forms URL that I gave you
            </p>
          </div>

          <button
            onClick={saveSettings}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormSettings;