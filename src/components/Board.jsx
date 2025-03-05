// src/components/Board.jsx
import React from 'react';
import BoardSquare from './BoardSquare';

const Board = ({ onSquareClick }) => {
  const boardValues = Array.from({ length: 36 }, (_, i) => i + 1);

  //We need to have access to the selectedSquares set in the parent.
  const [selectedSquares, setSelectedSquares] = React.useState(new Set());

    const handleSquareClick = (value) => {
        const newSelectedSquares = new Set(selectedSquares); // Create a copy

        if (newSelectedSquares.has(value)) {
            newSelectedSquares.delete(value); // Remove if already selected
        } else {
            newSelectedSquares.add(value);    // Add if not selected
        }

        setSelectedSquares(newSelectedSquares);
        onSquareClick(value);
    };

  return (
    <div className="board">
      {boardValues.map((value, index) => (
        <BoardSquare
          key={index}
          value={value}
          onClick={() => handleSquareClick(value)}
          isSelected={selectedSquares.has(value)} // Pass isSelected
        />
      ))}
    </div>
  );
};

export default Board;