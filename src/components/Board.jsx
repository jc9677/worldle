import React from 'react';

const Board = ({ board, getTileClass }) => {
  return (
    <div className="grid grid-rows-6 gap-2 mb-14 mx-auto">
      {board.map((row, i) => (
        <div key={i} className="flex justify-center gap-2">
          {row.map((letter, j) => (
            <div 
              key={j} 
              className={`
                w-14 h-14
                border-2 border-gray-600 
                flex items-center justify-center
                text-2xl font-bold uppercase
                ${getTileClass(i, j)}
              `}
            >
              {letter || '\u00A0'}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;