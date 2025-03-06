// src/components/Board.jsx
import React from 'react';
import BoardSquare from './BoardSquare'; // Assuming you have a separate BoardSquare component

const Board = ({ onSquareClick, boardValues }) => {
  // No need for local selectedSquares state here.  It's managed in App.jsx.

  return (
    <div className="board">
      {boardValues.map((value) => ( // Use the boardValues prop directly
        <BoardSquare
          key={value} // Use value as the key (since values are unique now)
          value={value}
          onClick={() => onSquareClick(value)} // Pass the value to the click handler
          // isSelected prop is no longer needed here, highlighting handled in App.css
        />
      ))}
    </div>
  );
};

export default Board;