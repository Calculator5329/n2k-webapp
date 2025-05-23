import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import Board from "../components/Board";
import SmartInputs from "../components/SmartInputs";
import { evaluateInput, splitStringNumber } from "../utils/writtenFuncs";
import { generatePatternBoard } from "../utils/boardFuncs";
import "../styles/BoardPage.css";
import { useNavigate } from "react-router-dom";
import Scoreboard from "../components/Scoreboard";
import { useAuth } from "../contexts/AuthContext";
import { updateGameStats } from "../utils/api";
import { Navigate } from "react-router-dom";

function BoardPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [boardValues, setBoardValues] = useState([]);
  const [diceTiers, setDiceTiers] = useState({});
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [patternNum, setPatternNum] = useState(0);
  const [diceNumbers, setDiceNumbers] = useState([0, 0, 0]);
  const [diceString, setDiceString] = useState("X, Y, Z");
  const [beginGame, setBeginGame] = useState(false);
  const [timer, setTimer] = useState(60);
  const [gameFinished, setGameFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [selectedSquares, setSelectedSquares] = useState(new Set());
  const [equationHistory, setEquationHistory] = useState([]);
  const historyRef = useRef(null);
  const [roundScores, setRoundScores] = useState([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [inFullRound, setInFullRound] = useState(false);
  const [buttonText, setButtonText] = useState("Start Round");
  const [showScoreboard, setShowScoreboard] = useState(false);
  const { user, loading } = useAuth();
  const userId = user?.firebase?.uid || "";
  const username = user?.username || "Unknown";
  const gameId = `pattern${patternNum}`;
  const difficulty = selectedDifficulty?.toLowerCase() || "medium";

  // ⏱️ Timer
  useEffect(() => {
    let intervalId;
    if (beginGame && !gameFinished && timer > 0) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            setGameFinished(true);
            const audio = new Audio("/sounds/TimerDone.mp3");
            audio.play();
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    } else if (!beginGame && timer !== 60) {
      setTimer(60);
    }

    return () => clearInterval(intervalId);
  }, [beginGame, gameFinished, timer]);

  // ⬇️ Scroll history table
  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [equationHistory]);

  // 🧠 Load board + dice tiers on mount
  useEffect(() => {
    const pattern = parseInt(searchParams.get("pattern"));
    const validPattern = !isNaN(pattern) && pattern > 0;
    const finalPattern = validPattern ? pattern : 2;
    setPatternNum(finalPattern);

    const newBoard = generatePatternBoard(finalPattern);
    setBoardValues(newBoard);

    fetch(`/dice/dicex${finalPattern}.json`)
      .then((res) => res.json())
      .then((diceMap) => setDiceTiers(diceMap))
      .catch((err) => {
        console.error("Failed to load dice config:", err);
      });
  }, []);

  if (loading) {
    return null; // or a spinner if you want
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  // 🧮 Submitting Input
  const handleInputSubmit = (inputObj) => {
    if (!beginGame || gameFinished) return;

    const result = evaluateInput(
      inputObj.n1,
      inputObj.n2,
      inputObj.n3,
      inputObj.num,
      diceNumbers,
      boardValues
    );

    const formatExp = (s) => {
      try {
        const [base, exp] = splitStringNumber(s, diceNumbers);
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

      setEquationHistory((prev) => [...prev.slice(-35), newEntry]);
      setSelectedSquares((prev) => new Set(prev).add(result));
      setScore((prev) => prev + result);
    }
  };

  // 🟦 Start Full Round (5 games)
  const handleStartRound = () => {
    if (!selectedDifficulty || !diceTiers) return;
    const tier = {
      Easy: "S",
      Medium: "A",
      Hard: "B",
      "Very Hard": "C",
      Impossible: "D",
    }[selectedDifficulty];

    const chosenDice = diceTiers[tier]?.[
      Math.floor(Math.random() * diceTiers[tier].length)
    ] || [2, 3, 5];

    setDiceNumbers(chosenDice);
    setDiceString(chosenDice.join(", "));
    setBeginGame(true);
    setGameFinished(false);
    setSelectedSquares(new Set());
    setEquationHistory([]);
    setScore(0);
    setButtonText("Next Game");
    setInFullRound(true);
  };

  // 🟦 End of 1 game
  const handleNextGame = () => {
    const newRoundScores = [...roundScores, score];
    setRoundScores(newRoundScores);

    if (currentRound < 2) {
      const tier = {
        Easy: "S",
        Medium: "A",
        Hard: "B",
        "Very Hard": "C",
        Impossible: "D",
      }[selectedDifficulty];

      const chosenDice = diceTiers[tier]?.[
        Math.floor(Math.random() * diceTiers[tier].length)
      ] || [2, 3, 5];

      setDiceNumbers(chosenDice);
      setDiceString(chosenDice.join(", "));
      setCurrentRound((prev) => prev + 1);
      setSelectedSquares(new Set());
      setEquationHistory([]);
      setScore(0);
      setTimer(60);
      setGameFinished(false);
      setBeginGame(true);
    } else {
      // Done with 5 games
      setShowScoreboard(true);
      setButtonText("Play Again");
      if (userId && gameId) {
        updateGameStats(userId, gameId).catch((err) =>
          console.error("Failed to update game stats:", err)
        );
      }
    }
  };

  // 🔄 Reset game entirely
  const handlePlayAgain = () => {
    const pattern = parseInt(searchParams.get("pattern"));
    const newBoard = generatePatternBoard(pattern || 2);
    setInFullRound(false);
    setCurrentRound(0);
    setBeginGame(false);
    setBoardValues(newBoard);
    setRoundScores([]);
    setSelectedDifficulty(null);
    setDiceString("X, Y, Z");
    setDiceNumbers([0, 0, 0]);
    setGameFinished(false);
    setBeginGame(false);
    setTimer(60);
    setButtonText("Start Round");
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const averageScore = roundScores.length
    ? Math.round(roundScores.reduce((a, b) => a + b, 0) / roundScores.length)
    : 0;

  return (
    <div className="app-container">
      <div className="horizontal-container">
        {window.innerWidth < 1000 && (
          <p style={{ color: "#aaa", fontSize: "0.8rem", marginTop: "1rem" }}>
            Playing board slam minigames is disabled on mobile devices. Please
            play using the "practice mode" or use a computer.
          </p>
        )}
        <div className="options-and-timer-container">
          <div className="options-container">
            <h1>Options</h1>

            {!inFullRound ? (
              <div className="difficulty-buttons">
                {["Easy", "Medium", "Hard", "Very Hard", "Impossible"].map(
                  (label) => (
                    <button
                      key={label}
                      disabled={beginGame || !diceTiers}
                      onClick={() => setSelectedDifficulty(label)}
                      className={`difficulty-button ${
                        selectedDifficulty === label ? "selected" : ""
                      }`}
                    >
                      {label}
                    </button>
                  )
                )}
              </div>
            ) : (
              <div className="round-score-table">
                <table>
                  <thead>
                    <tr>
                      <th>Round</th>
                      <th>Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roundScores.map((s, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{s}</td>
                      </tr>
                    ))}
                    {roundScores.length === 3 && (
                      <tr>
                        <td>Avg</td>
                        <td>{averageScore}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <Scoreboard
                  gameId={gameId}
                  difficulty={difficulty}
                  userScore={averageScore}
                  username={username}
                  userId={userId}
                  visible={showScoreboard}
                  onClose={() => setShowScoreboard(false)}
                />
              </div>
            )}

            <button
              className={`start-game-button ${beginGame ? "game-active" : ""}`}
              /*disabled={buttonText === "Next Game" && !gameFinished} */
              onClick={
                buttonText === "Start Round"
                  ? handleStartRound
                  : buttonText === "Next Game"
                  ? handleNextGame
                  : buttonText === "Play Again"
                  ? handlePlayAgain
                  : () => {}
              }
            >
              {buttonText}
            </button>
          </div>

          {inFullRound && (
            <div
              className="options-container"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <button className="btn-board" onClick={() => handlePlayAgain()}>
                Reset round
              </button>
              <button
                className="btn-board"
                onClick={() => navigate(`/practice?pattern=${patternNum}`)}
              >
                Practice on this board
              </button>
            </div>
          )}

          <div className="timer-container">
            <div className="digital-clock">{formatTime(timer)}</div>
          </div>
        </div>

        <div className="board-and-score-container">
          <div className="board-container">
            <Board
              onSquareClick={() => {}}
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

export default BoardPage;
