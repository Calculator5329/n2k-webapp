import React, { useState } from "react";
import Scoreboard from "../components/Scoreboard";
import { useAuth } from "../contexts/AuthContext";

export default function TestPage() {
  const { user } = useAuth();
  const [showBoard, setShowBoard] = useState(false);
  const [scoreInput, setScoreInput] = useState("");
  const [submittedScore, setSubmittedScore] = useState(null); // 🆕 separate state

  const handleOpenBoard = () => {
    setSubmittedScore(parseInt(scoreInput));
    setShowBoard(true);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Test Scoreboard</h1>

      <label style={{ display: "block", marginBottom: "1rem" }}>
        Enter Score:
        <input
          type="number"
          value={scoreInput}
          onChange={(e) => setScoreInput(e.target.value)}
          style={{ marginLeft: "1rem" }}
        />
      </label>

      <button onClick={handleOpenBoard} disabled={!scoreInput}>
        Submit & Show Scoreboard
      </button>

      {showBoard && (
        <Scoreboard
          gameId="pattern1"
          username={user?.username}
          userId={user?.firebase?.uid}
          userScore={submittedScore}
          visible={true}
          onClose={() => setShowBoard(false)}
        />
      )}
    </div>
  );
}
