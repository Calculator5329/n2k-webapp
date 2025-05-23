// src/components/BoardSquare.jsx
import React from 'react';

const BoardSquare = ({ value, onClick, isSelected }) => { // Receive isSelected prop

  const handleClick = () => {
    onClick(); // Call the parent click handler
  };

  return (
    <div
      className={`board-square ${isSelected ? 'highlighted' : ''}`} // Use isSelected
      onClick={handleClick}
      style={{ userSelect: "none" }} // Prevent text selection
      unselectable="on"
    >
      {value}
    </div>
  );
};

export default BoardSquare;