import React from 'react';
import { KEYBOARD_LAYOUT } from '../constants/keyboardLayout';

const Keyboard = ({ handleInput, letterStates }) => {
  const getKeyClass = (key) => {
    const baseClass = "py-4 rounded font-bold text-white";
    const widthClass = key.length > 1 ? "w-16" : "w-8";
    const colorClass = letterStates[key] ? 
      letterStates[key] : 
      "bg-gray-500";
    
    return `${baseClass} ${widthClass} ${colorClass}`;
  };

  // Create refs to track touch state
  const touchStartTarget = React.useRef(null);
  const shouldTrigger = React.useRef(true);

  const handleTouchStart = (e, key) => {
    e.preventDefault();
    touchStartTarget.current = e.target;
    shouldTrigger.current = true;
  };

  const handleTouchMove = (e) => {
    if (!touchStartTarget.current) return;
    
    // Get the element under the current touch position
    const touch = e.touches[0];
    const currentElement = document.elementFromPoint(touch.clientX, touch.clientY);
    
    // If we've moved outside the original button, cancel the input
    if (currentElement !== touchStartTarget.current) {
      shouldTrigger.current = false;
    }
  };

  const handleTouchEnd = (e, key) => {
    e.preventDefault();
    if (shouldTrigger.current && touchStartTarget.current) {
      handleInput(key);
    }
    touchStartTarget.current = null;
    shouldTrigger.current = true;
  };

  return (
    <div className="flex flex-col gap-2 px-0 w-full">
      {KEYBOARD_LAYOUT.map((row, i) => (
        <div key={i} className="flex justify-center gap-2">
          {row.map(key => (
            <button
              key={key}
              className={getKeyClass(key)}
              onTouchStart={(e) => handleTouchStart(e, key)}
              onTouchMove={handleTouchMove}
              onTouchEnd={(e) => handleTouchEnd(e, key)}
              onClick={(e) => {
                // Only handle click if it's not a touch event
                if (e.nativeEvent.pointerType !== 'touch') {
                  handleInput(key);
                }
              }}
            >
              {key === 'BACKSPACE' ? 'DEL' : key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
