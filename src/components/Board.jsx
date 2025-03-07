// src/components/Board.jsx
import React from 'react';
import BoardSquare from './BoardSquare';

const Board = ({ onSquareClick, boardValues, selectedSquares }) => {
  return (
    <div className="board">
      {boardValues.map((value) => (
        <BoardSquare
          key={value}
          value={value}
          onClick={() => onSquareClick(value)}
          isSelected={selectedSquares.has(value)}
        />
      ))}
    </div>
  );
};

export default Board;