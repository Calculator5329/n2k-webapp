// src/App.jsx
import React, { useState, useEffect } from 'react'; // Import useEffect
import Board from './components/Board';
import Dice from './components/Dice'; 
import './App.css';


function App() {
  const [selectedSquares, setSelectedSquares] = useState(new Set());
  const [score, setScore] = useState(0);
  const [diceNumbers, setDiceNumbers] = useState([2, 3, 5]);
  const [beginGame, setBeginGame] = useState(false);  // Add this line
  const diceString = diceNumbers.join(", ");
  const [highestNum, setHighestNum] = useState(36); // Initial value
  const [boardValues, setBoardValues] = useState(Array.from({ length: 36 }, (_, i) => i + 1)); // Initial board
  const [patternNum, setPatternNum] = useState(2);
  const [buttonText, setButtonText] = useState("Start Game");  // Add this line
  const [timer, setTimer] = useState(60);
  const [gameFinished, setGameFinished] = useState(false);

  // Use useEffect to recalculate the score whenever selectedSquares changes
  useEffect(() => {
    let newScore = 0;
    for (let value of selectedSquares) {
      newScore += value;
    }
    setScore(newScore);
  }, [selectedSquares]);

  // Add this new effect for timer logic
  useEffect(() => {
    let intervalId;
    if (beginGame && !gameFinished && timer > 0) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            setGameFinished(true);
            setSelectedSquares(new Set()); // Clear board square selections
            const audio = new Audio('./src/sounds/TimerDone.mp3'); // Play ding sound
            audio.play();
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    } else if (!beginGame && timer !== 60) {
      setTimer(60);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [beginGame, gameFinished, timer]);

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

  const handleStartGame = () => {
    setBeginGame(!beginGame);
    setGameFinished(false);
    setButtonText(beginGame ? "Start Game" : "End Game");
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

  // Add this new helper function
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="app-container">
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
            disabled={beginGame}
          />
          <button 
            className="submit-button" 
            onClick={handleSubmitR}
            disabled={beginGame}
          >
            Submit
          </button>
          <h2>- Pattern Board</h2>
          <label htmlFor="patternSlider">Count by: {patternNum}s</label>
          <input
            type="range"
            id="highestNumSlider"
            min="2"
            max="30"
            value={patternNum}
            onChange={handleSliderChangeP}
            disabled={beginGame}
          />
          <button 
            className="submit-button" 
            onClick={handleSubmitP}
            disabled={beginGame}
          >
            Submit
          </button>
          <div className="dice-wrapper">
            <Dice 
              diceNumbers={diceNumbers} 
              setDiceNumbers={setDiceNumbers}
              disabled={beginGame} 
            />
          </div>
          <button 
            className={`start-game-button ${beginGame ? 'game-active' : ''}`} 
            onClick={handleStartGame}
          >
            {buttonText}
          </button>
        </div>
      </div>
      <div className="timer-container">
        <div className="digital-clock">{formatTime(timer)}</div>
      </div>
      <div className="board-container">
        <Board 
          onSquareClick={handleSquareClick} 
          boardValues={boardValues} 
          selectedSquares={selectedSquares}
        />
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