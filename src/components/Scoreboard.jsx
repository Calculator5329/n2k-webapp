import React, { useEffect, useState } from "react";
import { fetchScores, submitScore, getUserInfo } from "../utils/api";
import "../styles/Scoreboard.css";

const SCORES_PER_PAGE = 10;
const MAX_PAGES = 10;

export default function Scoreboard({
  gameId,
  difficulty = "medium",
  userScore = null,
  username = "",
  userId = "",
  visible = false,
  onClose = () => {},
}) {
  const [scores, setScores] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [fadeClass, setFadeClass] = useState("scoreboard-fade");
  const [currentUserPic, setCurrentUserPic] = useState("profile.png");

  // Top 3 unique for medals
  const topUniqueUsers = [];
  const seen = new Set();
  for (const e of scores) {
    if (!seen.has(e.username)) {
      topUniqueUsers.push(e.username);
      seen.add(e.username);
      if (topUniqueUsers.length === 3) break;
    }
  }
  const medalMap = {
    [topUniqueUsers[0]]: "🥇",
    [topUniqueUsers[1]]: "🥈",
    [topUniqueUsers[2]]: "🥉",
  };
  const medalGiven = {};

  // Estimated rank
  const estimatedRank =
    userScore !== null
      ? [...scores]
          .sort((a, b) => b.score - a.score)
          .findIndex((s) => userScore >= s.score) + 1
      : null;
  const showEstimated = estimatedRank > 0 && estimatedRank <= 100;

  // Load scores
  useEffect(() => {
    if (!visible) return;
    (async () => {
      try {
        const result = gameId.startsWith("written_")
          ? await fetchScores(gameId)
          : await fetchScores(gameId, difficulty);
        setScores(Array.isArray(result) ? result : []);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [visible, gameId, difficulty]);

  // Load user avatar
  useEffect(() => {
    if (!visible) return;
    getUserInfo()
      .then((data) => data.profile_pic && setCurrentUserPic(data.profile_pic))
      .catch(() => {});
  }, [visible]);

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
  const start = (currentPage - 1) * SCORES_PER_PAGE;
  const slice = scores.slice(start, start + SCORES_PER_PAGE);

  const isSaved =
    userScore !== null &&
    scores.some((s) => s.username === username && s.score === userScore);

  const handleSave = async () => {
    try {
      const payload = { user_id: userId, username, score: userScore };
      if (!gameId.startsWith("written_")) payload.difficulty = difficulty;
      const res = await submitScore(gameId, payload);
      if (res.success) {
        const updated = gameId.startsWith("written_")
          ? await fetchScores(gameId)
          : await fetchScores(gameId, difficulty);
        setScores(updated);
      } else alert("Score not high enough to be saved.");
    } catch (err) {
      console.error(err);
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
              {slice.map((entry, idx) => {
                const rank = start + idx + 1;
                let display = rank;
                if (medalMap[entry.username] && !medalGiven[entry.username]) {
                  display = medalMap[entry.username];
                  medalGiven[entry.username] = true;
                }
                const isCurrent = entry.username === username;
                return (
                  <tr
                    key={rank}
                    className={isCurrent ? "scoreboard-highlight" : ""}
                  >
                    <td>
                      {typeof display === "number" ? `${display}` : display}
                    </td>
                    <td>
                      <div className="user-cell">
                        {isCurrent && (
                          <img
                            src={`${
                              import.meta.env.BASE_URL
                            }/avatars/${currentUserPic}`}
                            alt="You"
                            className="avatar-icon-scoreboard"
                            onError={(e) =>
                              (e.currentTarget.src = "/avatars/profile.png")
                            }
                          />
                        )}
                        <span>{entry.username}</span>
                      </div>
                    </td>
                    <td>{entry.score}</td>
                  </tr>
                );
              })}
              {!isSaved && userScore !== null && (
                <>
                  <tr className="spacer-row">
                    <td colSpan={3}></td>
                  </tr>
                  <tr className="scoreboard-highlight">
                    <td>{showEstimated ? estimatedRank : "???"}</td>
                    <td>
                      <div className="user-cell">
                        <img
                          src={`${
                            import.meta.env.BASE_URL
                          }/avatars/${currentUserPic}`}
                          alt="You"
                          className="avatar-icon-scoreboard"
                          onError={(e) =>
                            (e.currentTarget.src = "/avatars/profile.png")
                          }
                        />
                        <span>{username || "You"}</span>
                      </div>
                    </td>
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
          {!isSaved && userScore !== null && (
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
