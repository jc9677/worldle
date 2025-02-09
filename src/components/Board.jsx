import React from 'react';

const Board = ({ board, getTileClass }) => {
  return (
    <div className="grid grid-rows-6 gap-1 mb-8 w-[320px] sm:w-[330px] mx-auto px-2">
      {board.map((row, i) => (
        <div key={i} className="grid grid-cols-5 gap-1">
          {row.map((letter, j) => (
            <div 
              key={j} 
              className={`
                w-[60px] sm:w-[62px] h-[60px] sm:h-[62px] border-2 border-gray-600 
                flex items-center justify-center
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