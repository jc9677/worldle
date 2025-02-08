import React from 'react';
import { KEYBOARD_LAYOUT } from '../constants/keyboardLayout';

const Keyboard = ({ handleInput, letterStates }) => {
  const getKeyClass = (key) => {
    const baseClass = key.length > 1 ? 'key wide' : 'key';
    return `${baseClass} ${letterStates[key] || ''}`;
  };

  return (
    <div className="keyboard">
      {KEYBOARD_LAYOUT.map((row, i) => (
        <div key={i} className="keyboard-row">
          {row.map(key => (
            <button
              key={key}
              className={getKeyClass(key)}
              onClick={() => handleInput(key)}
            >
              {key === 'BACKSPACE' ? '←' : key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
