import React, { useEffect, useState } from "react";
import { fetchScores, submitScore } from "../utils/api";
import "../styles/Scoreboard.css";

const SCORES_PER_PAGE = 10;
const MAX_PAGES = 10;

export default function Scoreboard({
  gameId,
  userScore = null,
  username = "",
  userId = "",
  visible = false,
  onClose = () => {},
}) {
  const [scores, setScores] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [fadeClass, setFadeClass] = useState("scoreboard-fade");

  // Estimate the user's rank even if they're not in the fetched scores
  const estimatedRank =
    userScore !== null
      ? [...scores]
          .sort((a, b) => b.score - a.score)
          .findIndex((s) => userScore >= s.score) + 1
      : null;

  const showEstimated = estimatedRank > 0 && estimatedRank <= 100;

  useEffect(() => {
    if (!visible) return;

    const loadScores = async () => {
      try {
        const result = await fetchScores(gameId);
        setScores(Array.isArray(result) ? result : []);
      } catch (err) {
        console.error("Failed to fetch scores:", err);
      }
    };

    loadScores();
  }, [visible, gameId]);

  useEffect(() => {
    setFadeClass("scoreboard-fade");
    const t = setTimeout(() => setFadeClass(""), 300);
    return () => clearTimeout(t);
  }, [currentPage]);

  if (!visible) return null;

  const totalPages = Math.min(
    Math.ceil(scores.length / SCORES_PER_PAGE),
    MAX_PAGES
  );
  const startIndex = (currentPage - 1) * SCORES_PER_PAGE;
  const endIndex = startIndex + SCORES_PER_PAGE;
  const displayedScores = scores.slice(startIndex, endIndex);

  const isScoreAlreadySaved =
    userScore !== null &&
    scores.some((s) => s.username === username && s.score === userScore);

  const handleSave = async () => {
    try {
      const res = await submitScore(gameId, {
        user_id: userId,
        username,
        score: userScore,
      });

      if (res.success) {
        const updated = await fetchScores(gameId);
        setScores(updated);
      } else {
        alert("Score not high enough to be saved.");
      }
    } catch (err) {
      console.error("Score save failed:", err);
    }
  };

  return (
    <div className="scoreboard-backdrop">
      <div className="scoreboard-modal">
        <h2>🏆 Scoreboard</h2>

        <div className={`scoreboard-table-wrapper ${fadeClass}`}>
          <table className="scoreboard-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Username</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {displayedScores.map((entry, index) => (
                <tr
                  key={startIndex + index}
                  className={
                    entry.username === username ? "scoreboard-highlight" : ""
                  }
                >
                  <td>{startIndex + index + 1}</td>
                  <td>{entry.username}</td>
                  <td>{entry.score}</td>
                </tr>
              ))}

              {!isScoreAlreadySaved && userScore !== null && (
                <>
                  <tr className="spacer-row">
                    <td colSpan="3"></td>
                  </tr>
                  <tr className="scoreboard-highlight">
                    <td>{showEstimated ? estimatedRank : "???"}</td>

                    <td>{username || "You"}</td>
                    <td>{userScore}</td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>

        <div className="scoreboard-buttons">
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                ← Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={currentPage === i + 1 ? "active" : ""}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                Next →
              </button>
            </div>
          )}

          {!isScoreAlreadySaved && userScore !== null && (
            <button className="save-button" onClick={handleSave}>
              Save My Score: {userScore}
            </button>
          )}

          <button className="close-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
