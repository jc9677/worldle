import React from 'react';
import { KEYBOARD_LAYOUT } from '../constants/keyboardLayout';

const Keyboard = ({ handleInput, letterStates }) => {
  const getKeyClass = (key) => {
    const baseClass = "px-2 py-4 rounded font-bold text-white";
    const widthClass = key.length > 1 ? "min-w-[65px]" : "min-w-[35px]";
    const colorClass = letterStates[key] ? 
      `bg-${letterStates[key]}` : 
      "bg-gray-500";
    
    return `${baseClass} ${widthClass} ${colorClass}`;
  };

  return (
    <div className="flex flex-col gap-2 p-2 max-w-screen-sm mx-auto">
      {KEYBOARD_LAYOUT.map((row, i) => (
        <div key={i} className="flex justify-center gap-1.5">
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