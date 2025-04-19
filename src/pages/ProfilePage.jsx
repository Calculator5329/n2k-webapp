import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  updateProfilePic,
  getUserMedals,
  getUserGameStats,
  getUserInfo,
} from "../utils/api";
import "../styles/ProfilePage.css";
import { Navigate } from "react-router-dom";

const presetAvatars = Array.from(
  { length: 20 },
  (_, i) => `avatar${i + 1}.png`
);

function ProfilePage() {
  const { user, loading, refreshUserInfo } = useAuth();
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState("");
  const [medals, setMedals] = useState([]);
  //const [gameStats, setGameStats] = useState({});
  const [favoriteGame, setFavoriteGame] = useState(null);
  const DIFFICULTY_COLORS = {
    easy: "#4CAF50", // green
    medium: "#2196F3", // blue
    hard: "#FF3C00", // orange
    very_hard: "#FF0000", // red
    impossible: "#9C27B0", // purple
  };
  const [newUsername, setNewUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [editingUsername, setEditingUsername] = useState(false);

  const handleUsernameChange = async () => {
    setEditingUsername(false);

    const trimmed = newUsername.trim();

    if (!trimmed) {
      setUsernameMessage("❌ Username cannot be empty.");
      return;
    }

    if (trimmed === user?.username) {
      setUsernameMessage("✅ No Changes.");
      return;
    }

    if (!/^[a-zA-Z0-9_]{3,15}$/.test(trimmed)) {
      setUsernameMessage("❌ 3–15 letters, numbers, or underscores only.");
      return;
    }

    try {
      const token = await user.firebase.getIdToken();
      const res = await fetch("/api/change_username", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username: trimmed }),
      });

      if (res.status === 409) {
        setUsernameMessage("❌ Username already taken.");
        return;
      }

      if (!res.ok) {
        throw new Error("Unexpected error");
      }

      await refreshUserInfo(user.firebase);
      setUsernameMessage("✅ Username updated!");
    } catch (err) {
      console.error("❌ Error updating username:", err.message);
      setUsernameMessage("❌ Failed to update username.");
    }
  };

  useEffect(() => {
    if (usernameMessage) {
      const timer = setTimeout(() => {
        setUsernameMessage("");
      }, 3000); // 3 seconds

      return () => clearTimeout(timer);
    }
  }, [usernameMessage]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [medals, stats] = await Promise.all([
          getUserMedals(user.firebase.uid),
          getUserGameStats(user.firebase.uid),
        ]);
        setMedals(medals);
        //setGameStats(stats);

        const maxGame = Object.entries(stats).sort((a, b) => b[1] - a[1])[0];
        if (maxGame) setFavoriteGame(maxGame[0]);
      } catch (err) {
        console.error("❌ Error fetching profile data:", err);
      }
    }

    if (user?.firebase?.uid) {
      fetchData();
    }
  }, [user]);

  function formatGameName(gameId) {
    // Remove trailing difficulty suffix from gameId if present
    const cleanedId = gameId.replace(
      /_easy|_medium|_hard|_very_hard|_very hard|_impossible/,
      ""
    );

    if (cleanedId.startsWith("pattern")) {
      const num = cleanedId.replace("pattern", "");
      // const diffLetter = (difficulty || "medium")[0].toUpperCase(); // e.g. Easy → E
      return `${num}s Board`;
    }

    if (cleanedId.startsWith("written")) {
      //console.log(cleanedId);
      //console.log(difficulty);
      /*const labels = {
        easy: "(E)",
        medium: "(M)",
        hard: "(H)",
        very_hard: "(VH)",
        impossible: "(I)",
      };
      const label = labels[difficulty] || "";*/
      return `Written Problems`;
    }

    return cleanedId; // fallback
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const [medals, stats, userInfo] = await Promise.all([
          getUserMedals(user.firebase.uid),
          getUserGameStats(user.firebase.uid),
          getUserInfo(),
        ]);

        setMedals(medals);
        //setGameStats(stats);

        const maxGame = Object.entries(stats).sort((a, b) => b[1] - a[1])[0];
        if (maxGame) setFavoriteGame(maxGame[0]);

        // Update user object with new createdAt
        user.createdAt = userInfo.created_at;
      } catch (err) {
        console.error("❌ Error fetching profile data:", err);
      }
    }

    if (user?.firebase?.uid) {
      fetchData();
    }
  }, [user]);

  if (loading) return null; // or a spinner

  if (!user) return <Navigate to="/login" />;

  const handleSubmit = async () => {
    try {
      await updateProfilePic(selected);
      await refreshUserInfo(user.firebase);
      setMessage("✅ Updated!");
    } catch (err) {
      console.error("❌ Failed to update:", err.message);
      setMessage("❌ Failed to update");
    }
  };

  return (
    <div className="profile-page">
      <div className="avatar-container">
        <h1>Choose Your Avatar</h1>
        <div className="avatar-grid">
          {presetAvatars.map((avatar) => (
            <img
              key={avatar}
              src={`/avatars/${avatar}`}
              alt={avatar}
              className={`avatar-option ${
                selected === avatar ? "selected" : ""
              }`}
              onClick={() => setSelected(avatar)}
            />
          ))}
        </div>
        <button onClick={handleSubmit} disabled={!selected}>
          Save Avatar
        </button>
        {message && <p>{message}</p>}
      </div>

      <div className="info-and-medals-container">
        <div className="info-container">
          <div className="username-header">
            {usernameMessage && (
              <div className="username-toast">{usernameMessage}</div>
            )}
            <img
              src={`/avatars/${user?.profilePic || "profile.png"}`}
              alt="Current Avatar"
              style={{ height: "80px", width: "80px", borderRadius: "50%" }}
            />
            {editingUsername ? (
              <input
                autoFocus
                className="username-input"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                onBlur={handleUsernameChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleUsernameChange();
                }}
              />
            ) : (
              <h1
                style={{ margin: 0, cursor: "pointer" }}
                onClick={() => {
                  setEditingUsername(true);
                  setNewUsername(user?.username || "");
                }}
                title="Click to edit"
              >
                {user?.username || "Guest"}
              </h1>
            )}
          </div>
          <table className="user-info-table">
            <tbody>
              <tr>
                <td className="label">Email:</td>
                <td>{user?.firebase?.email || "N/A"}</td>
              </tr>
              <tr>
                <td className="label">Favorite:</td>
                <td>
                  {favoriteGame
                    ? formatGameName(favoriteGame)
                    : "No games played yet"}
                </td>
              </tr>
              <tr>
                <td className="label">Joined:</td>
                <td>
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "N/A"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="medals-container">
          <h2>Your Medals 🏅</h2>
          <div className="medal-grid">
            {medals.map((medal, i) => {
              const imageSrc = `/trophies/trophy${medal.rank}.png`;

              const difficultyMatch = medal.game_id.match(
                /_(easy|medium|hard|very_hard|impossible)(?:_|$)/
              );
              const difficulty = difficultyMatch?.[1]; // may be undefined
              const borderColor = DIFFICULTY_COLORS[difficulty] || "#a00000"; // fallback

              return (
                <div className="medal-item" key={i}>
                  <img
                    src={imageSrc}
                    className="medal-image"
                    alt="Game"
                    style={{
                      border: `2px solid ${borderColor}`,
                      borderRadius: "12px",
                    }}
                  />
                  <div className="medal-label">
                    {formatGameName(medal.game_id)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
