import React, { useRef, useState } from "react";
import {
  generateEquationByDifficulty,
  checkAnswer,
} from "../utils/writtenProblems";
import "../styles/WrittenProblemsPage.css";
import { useSearchParams } from "react-router-dom";
import Scoreboard from "../components/Scoreboard";
import { useAuth } from "../contexts/AuthContext";

const DIFFICULTIES = ["easy", "medium", "hard", "very hard", "impossible"];

function WrittenProblemsPage() {
  const [phase, setPhase] = useState("select"); // "select", "round", "done"
  const [difficulty, setDifficulty] = useState(null);
  const [problems, setProblems] = useState([]);
  const [current, setCurrent] = useState(0);
  const [inputs, setInputs] = useState({ x: "", y: "", z: "" });
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [feedback, setFeedback] = useState("");

  const xRef = useRef(null);
  const yRef = useRef(null);
  const zRef = useRef(null);
  const [searchParams] = useSearchParams();

  const [showScoreboard, setShowScoreboard] = useState(true);

  const { user } = useAuth();
  const userId = user?.firebase?.uid || "";
  const username = user?.username || "Unknown";

  const gameId = `written_${difficulty?.toLowerCase()}`;

  const capitalizeWords = (str) =>
    str.replace(/\b\w/g, (char) => char.toUpperCase());

  const startRound = (selectedDifficulty) => {
    const generated = Array.from({ length: 5 }, () =>
      generateEquationByDifficulty(selectedDifficulty)
    );
    setDifficulty(selectedDifficulty);
    setProblems(generated);
    setPhase("round");
    setStartTime(Date.now());
    setCurrent(0);
    setInputs({ x: "", y: "", z: "" });
    setFeedback("");
  };

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleKeyDown = (e, index) => {
    const refs = [xRef, yRef, zRef];

    if (e.key === "Enter") {
      e.preventDefault();
      if (index < 2) {
        refs[index + 1].current.focus();
      } else if (inputs.x && inputs.y && inputs.z) {
        handleSubmit(e);
      }
    }

    if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      refs[index - 1].current.focus();
    }

    if (e.key === "ArrowRight" && index < 2) {
      e.preventDefault();
      refs[index + 1].current.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const x = parseInt(inputs.x);
    const y = parseInt(inputs.y);
    const z = parseInt(inputs.z);

    const correct = checkAnswer(problems[current], x, y, z);
    if (!correct) {
      setFeedback("❌ Try Again!");
      setInputs({ x: "", y: "", z: "" });
      xRef.current.focus();
      return;
    }

    if (current === 4) {
      setEndTime(Date.now());
      setPhase("done");
    } else {
      setCurrent((prev) => prev + 1);
      setInputs({ x: "", y: "", z: "" });
      setFeedback("");
      xRef.current.focus();
    }
  };

  const reset = () => {
    setPhase("select");
    setShowScoreboard(true);
    setDifficulty(null);
    setProblems([]);
    setCurrent(0);
    setStartTime(null);
    setEndTime(null);
    setInputs({ x: "", y: "", z: "" });
    setFeedback("");
  };

  const renderProblem = (problem) => (
    <>
      <p className="equation-display">
        x<sup>{problem.exponents[0]}</sup> {problem.operators.symbols[0]} y
        <sup>{problem.exponents[1]}</sup> {problem.operators.symbols[1]} z
        <sup>{problem.exponents[2]}</sup> = <b>{problem.answer}</b>
      </p>
      <p>Difficulty Score: {problem.difficulty}</p>
    </>
  );

  return (
    <div className="main-container">
      <div className="app-container written-page">
        <h1>Written Problems</h1>

        {phase === "select" && (
          <>
            {!searchParams.get("difficulty") ? (
              <>
                <h2>Select Difficulty</h2>
                <div className="difficulty-buttons">
                  {DIFFICULTIES.map((level) => (
                    <button
                      key={level}
                      onClick={() => startRound(level)}
                      className="difficulty-button"
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <h2>
                  Difficulty: {capitalizeWords(searchParams.get("difficulty"))}
                </h2>

                <button
                  className="start-game-button"
                  style={{ width: "200px" }}
                  onClick={() =>
                    startRound(searchParams.get("difficulty").toLowerCase())
                  }
                >
                  Start Round
                </button>
              </>
            )}
          </>
        )}

        {phase === "round" && (
          <>
            <h3>
              Problem {current + 1}/5 ({capitalizeWords(difficulty)})
            </h3>
            {renderProblem(problems[current])}

            <form className="written-form" onSubmit={handleSubmit}>
              <input
                type="number"
                name="x"
                placeholder="x"
                value={inputs.x}
                onChange={handleChange}
                onKeyDown={(e) => handleKeyDown(e, 0)}
                ref={xRef}
                required
              />
              <input
                type="number"
                name="y"
                placeholder="y"
                value={inputs.y}
                onChange={handleChange}
                onKeyDown={(e) => handleKeyDown(e, 1)}
                ref={yRef}
                required
              />
              <input
                type="number"
                name="z"
                placeholder="z"
                value={inputs.z}
                onChange={handleChange}
                onKeyDown={(e) => handleKeyDown(e, 2)}
                ref={zRef}
                required
              />
              <button type="submit">Submit</button>
            </form>
            {feedback && <p className="feedback">{feedback}</p>}
          </>
        )}

        {phase === "done" &&
          (console.log("✅ Done phase reached"),
          (
            <>
              <h2>🎉 Round Complete!</h2>
              <p>
                Total Time:{" "}
                <strong>{((endTime - startTime) / 1000).toFixed(2)}s</strong>
              </p>

              <button onClick={reset}>Play Again</button>

              <Scoreboard
                gameId={gameId}
                difficulty={difficulty}
                userScore={Math.round((60 * 1e6) / (endTime - startTime))} // You can tweak score formula
                username={username}
                userId={userId}
                visible={showScoreboard}
                onClose={() => setShowScoreboard(false)}
              />
            </>
          ))}
      </div>
    </div>
  );
}

export default WrittenProblemsPage;
