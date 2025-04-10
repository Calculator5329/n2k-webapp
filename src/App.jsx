// src/App.jsx
import React, { useState, useEffect, useRef } from "react"; // Import useEffect
import Board from "./components/Board";
import Dice from "./components/Dice";
import { evaluateInput } from "./utils/writtenFuncs";
import SmartInputs from "./components/SmartInputs";
import { generateRandomBoard, generatePatternBoard } from "./utils/boardFuncs";
import "./App.css";

function App() {
  const [selectedSquares, setSelectedSquares] = useState(new Set());
  const [score, setScore] = useState(0);
  const [diceNumbers, setDiceNumbers] = useState([2, 3, 5]);
  const [beginGame, setBeginGame] = useState(false); // Add this line
  const diceString = diceNumbers.join(", ");
  const [highestNum, setHighestNum] = useState(36); // Initial value
  const [boardValues, setBoardValues] = useState(
    Array.from({ length: 36 }, (_, i) => i + 1)
  ); // Initial board
  const [patternNum, setPatternNum] = useState(2);
  const [buttonText, setButtonText] = useState("Start Game"); // Add this line
  const [timer, setTimer] = useState(60);
  const [gameFinished, setGameFinished] = useState(false);
  const [equationHistory, setEquationHistory] = useState([]);
  const historyRef = useRef(null);
  const [useClicks] = useState(false);

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
            const audio = new Audio("./src/sounds/TimerDone.mp3"); // Play ding sound
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

  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [equationHistory]);

  const handleInputSubmit = (inputObj) => {
    if (!beginGame || gameFinished) {
      console.log("⛔ Can't submit before round begins or after it ends.");
      return;
    }

    const result = evaluateInput(
      inputObj.n1,
      inputObj.n2,
      inputObj.n3,
      inputObj.num,
      diceNumbers,
      boardValues
    );

    // Format something like "2^3"
    const formatExp = (s) => {
      try {
        const base = parseInt(s.slice(0, -1));
        const exp = parseInt(s.slice(-1));
        return `${base}^${exp}`;
      } catch {
        return "?";
      }
    };

    if (result) {
      const newEntry = {
        equation: `${formatExp(inputObj.n1)}, ${formatExp(
          inputObj.n2
        )}, ${formatExp(inputObj.n3)}`,
        result: `${result} ✅`,
      };

      setEquationHistory((prev) => {
        const updated = [...prev, newEntry];
        return updated.slice(-36);
      });

      setSelectedSquares((prev) => new Set(prev).add(result));
      setScore((prev) => prev + result);
    } else {
      console.log("❌ Scratch");
    }
  };

  const handleSquareClick = (value) => {
    if (!useClicks) return; // ignore clicks unless enabled

    const newSelectedSquares = new Set(selectedSquares);
    if (newSelectedSquares.has(value)) {
      newSelectedSquares.delete(value);
    } else {
      newSelectedSquares.add(value);
    }
    setSelectedSquares(newSelectedSquares);
  };

  const handleSliderChangeR = (event) => {
    setHighestNum(parseInt(event.target.value, 10));
  };

  const handleSliderChangeP = (event) => {
    setPatternNum(parseInt(event.target.value, 10));
  };

  const handleSubmitR = () => {
    const newBoardValues = generateRandomBoard(highestNum);
    setBoardValues(newBoardValues);
  };

  const handleSubmitP = () => {
    const newBoardValues = generatePatternBoard(patternNum);
    setBoardValues(newBoardValues);
  };

  const handleStartGame = () => {
    if (!beginGame) {
      setSelectedSquares(new Set());
      setEquationHistory([]);
      setScore(0);
      setTimer(60);
      setGameFinished(false);
    }

    setBeginGame(!beginGame);
    setButtonText(beginGame ? "Begin Round" : "End Round");
  };

  // Add this new helper function
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="app-container">
      <div className="horizontal-container">
        <div className="options-and-timer-container">
          <div className="options-container">
            <h1>Options</h1>
            <div className="option-group">
              <h2>- Random Board</h2>
              <label htmlFor="highestNumSlider">
                Highest Number: {highestNum}
              </label>
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
                className={`start-game-button ${
                  beginGame ? "game-active" : ""
                }`}
                onClick={handleStartGame}
              >
                {buttonText}
              </button>
            </div>
          </div>
          <div className="timer-container">
            <div className="digital-clock">{formatTime(timer)}</div>
          </div>
        </div>
        <div className="board-and-score-container">
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
        <div className="new-input-container">
          <SmartInputs onSubmit={handleInputSubmit} />
          <div className="history-table" ref={historyRef}>
            <table>
              <thead>
                <tr>
                  <th>Equation</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                {equationHistory.map((entry, index) => (
                  <tr key={index}>
                    <td>{entry.equation}</td>
                    <td>{entry.result}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
