import React from 'react';

const Board = ({ board, getTileClass }) => {
  return (
    <div className="grid grid-rows-6 gap-1 mb-8 max-w-sm mx-auto">
      {board.map((row, i) => (
        <div key={i} className="grid grid-cols-5 gap-1">
          {row.map((letter, j) => (
            <div 
              key={j} 
              className={`
                w-14 h-14 border-2 border-gray-600 flex items-center justify-center
                text-2xl font-bold uppercase
                ${getTileClass(i, j)}
              `}
            >
              {letter}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;