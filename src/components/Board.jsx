import React from 'react';

const Board = ({ board, getTileClass }) => {
  return (
    <div className="game-grid">
      {board.map((row, i) => (
        <div key={i} className="grid-row">
          {row.map((letter, j) => (
            <div key={j} className={getTileClass(i, j)}>
              {letter}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;
