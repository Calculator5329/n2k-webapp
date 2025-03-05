// src/App.jsx
import React, { useState, useEffect } from 'react'; // Import useEffect
import Board from './components/Board';
import './App.css';

function App() {
  const [selectedSquares, setSelectedSquares] = useState(new Set());
  const [score, setScore] = useState(0);

  // Use useEffect to recalculate the score whenever selectedSquares changes
  useEffect(() => {
    let newScore = 0;
    for (let value of selectedSquares) {
      newScore += value;
    }
    setScore(newScore);
  }, [selectedSquares]);

  const handleSquareClick = (value) => {
    const newSelectedSquares = new Set(selectedSquares); // Create a copy

    if (newSelectedSquares.has(value)) {
      newSelectedSquares.delete(value); // Remove if already selected
    } else {
      newSelectedSquares.add(value);    // Add if not selected
    }

    setSelectedSquares(newSelectedSquares);
  };


  return (
    <div className="app-container">
      <h1>Score: {score}</h1>
      <div className="board-container">
        <Board onSquareClick={handleSquareClick} />
      </div>
    </div>
  );
}

export default App;