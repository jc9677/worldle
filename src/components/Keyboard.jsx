import React from 'react';
import { KEYBOARD_LAYOUT } from '../constants/keyboardLayout';

const Keyboard = ({ handleInput, letterStates }) => {
  const getKeyClass = (key) => {
    const baseClass = "py-4 rounded font-bold text-white";
    const widthClass = key.length > 1 ? "w-16" : "w-9"; // w-16 = 4rem (64px), w-8 = 2rem (32px)
    const colorClass = letterStates[key] ? 
      letterStates[key] : 
      "bg-gray-500";
    
    return `${baseClass} ${widthClass} ${colorClass}`;
  };

  const handleTouch = (e, key) => {
    e.preventDefault();  // Prevent default touch behavior
    e.stopPropagation(); // Stop event from bubbling
    handleInput(key);
  };

  return (
    <div className="flex flex-col gap-2 p-2 max-w-screen-sm mx-auto">
      {KEYBOARD_LAYOUT.map((row, i) => (
        <div key={i} className="flex justify-center gap-1.5">
          {row.map(key => (
            <button
              key={key}
              className={getKeyClass(key)}
              onTouchEnd={(e) => handleTouch(e, key)}
              onClick={(e) => {
                // Only handle click if it's not a touch event
                if (e.type !== 'touchend') {
                  handleInput(key);
                }
              }}
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