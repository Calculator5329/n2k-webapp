// src/App.jsx
import React, { useState, useEffect } from 'react'; // Import useEffect
import Board from './components/Board';
import Dice from './components/Dice'; 
import './App.css';


function App() {
  const [selectedSquares, setSelectedSquares] = useState(new Set());
  const [score, setScore] = useState(0);
  const [diceNumbers, setDiceNumbers] = useState([2, 3, 5]);
  const diceString = diceNumbers.join(", ");
  const [highestNum, setHighestNum] = useState(36); // Initial value
  const [boardValues, setBoardValues] = useState(Array.from({ length: 36 }, (_, i) => i + 1)); // Initial board
  const [patternNum, setPatternNum] = useState(2);

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

  const handleSliderChangeR = (event) => {
    setHighestNum(parseInt(event.target.value, 10));
  };

  const handleSliderChangeP = (event) => {
    setPatternNum(parseInt(event.target.value, 10));
  }

  const handleSubmitR = () => {

    const newBoardValues = generateRandomBoard(highestNum);
    setBoardValues(newBoardValues);
  };

  const handleSubmitP = () => {
    const newBoardValues = generatePatternBoard(patternNum);
    setBoardValues(newBoardValues);
  };

    // Helper function to generate the random board values
    const generateRandomBoard = (max) => {
        const boardSize = 36; // Always a 6x6 board
        const numbers = [];
        
        // If max is less than 36, just return 1 to max in order
        if(max < boardSize)
        {
            for (let i = 1; i <= max; i++) {
                numbers.push(i);
            }
            return numbers;
        }

        // Create a set to ensure uniqueness.
        const uniqueNumbers = new Set();
    
        // Generate unique random numbers until we have enough for the board.
        while (uniqueNumbers.size < boardSize) {
          const randomNumber = Math.floor(Math.random() * max) + 1;
          uniqueNumbers.add(randomNumber);
        }
    
        // Convert the set to an array and sort it.
        const sortedNumbers = Array.from(uniqueNumbers).sort((a, b) => a - b);
        return sortedNumbers;
      };
    
    const generatePatternBoard = (pattern) => {
        const boardSize = 36; // Always a 6x6 board
        const numbers = [];
        for (let i = 1; i <= boardSize; i++) {
            numbers.push(i * pattern);
        }
        return numbers;
    };

  return (

    <div className="app-container">
    {/* Options Menu - Completely Separate */}
    <div className="options-container">
      <h1>Options</h1>
      <div className="option-group">
        <h2>- Random Board</h2>
        <label htmlFor="highestNumSlider">Highest Number: {highestNum}</label>
        <input
          type="range"
          id="highestNumSlider"
          min="36"
          max="999"
          value={highestNum}
          onChange={handleSliderChangeR}
        />
        <button className="submit-button" onClick={handleSubmitR}>Submit</button>
        <h2>- Pattern Board</h2>
        <label htmlFor="patternSlider">Count by: {patternNum}s</label>
        <input
          type="range"
          id="highestNumSlider"
          min="2"
          max="30"
          value={patternNum}
          onChange={handleSliderChangeP}
        />
        <button className="submit-button" onClick={handleSubmitP}>Submit</button>
        <div className="dice-wrapper">
        <Dice diceNumbers={diceNumbers} setDiceNumbers={setDiceNumbers} />
      </div>
      </div>
    </div>
      <div className="board-container">
      <Board onSquareClick={handleSquareClick} boardValues={boardValues} />
      </div>
      <div className="score-container">
      <span className="dice-text">Dice: {diceString}</span>
      <span className="separator">|</span>
      <span className="score-text">Score: {score}</span>
    </div>
    </div>
  );
}

export default App;