import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const FormSettings = ({ isOpen, onClose }) => {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [sheetId, setSheetId] = useState('');
  const [playerName, setPlayerName] = useState('');
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
    if (fullCode.includes(SEPARATOR)) {
      const [webhookPart, sheetPart] = fullCode.split(SEPARATOR);
      setWebhookUrl(webhookPart);
      setSheetId(sheetPart);
    } else {
      // If no separator found, store everything in webhookUrl
      setWebhookUrl(fullCode);
      setSheetId('');
    }
  };

  const saveSettings = () => {
    localStorage.setItem('worldle_webhook_url', webhookUrl);
    localStorage.setItem('worldle_player_name', playerName);
    localStorage.setItem('worldle_sheet_id', sheetId);
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
              className="w-full p-2 rounded bg-gray-700 border border-gray-600"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Access code</label>
            <input
              type="text"
              className="w-full p-2 rounded bg-gray-700 border border-gray-600"
              value={displayAccessCode}
              onChange={handleAccessCodeChange}
              placeholder="<big long weird code goes here>"
            />
            <p className="text-xs text-gray-400 mt-1">
              Enter the form ID that I gave you
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