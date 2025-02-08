import React from 'react';

const Tile = ({ letter, tileClass }) => {
  return (
    <div className={tileClass}>
      {letter}
    </div>
  );
};

export default Tile;
