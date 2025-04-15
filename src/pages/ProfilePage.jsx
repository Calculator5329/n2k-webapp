import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  updateProfilePic,
  getUserMedals,
  getUserGameStats,
  getUserInfo,
} from "../utils/api";
import "../styles/ProfilePage.css";

const presetAvatars = Array.from(
  { length: 20 },
  (_, i) => `avatar${i + 1}.png`
);

function ProfilePage() {
  const { user, refreshUserInfo } = useAuth();
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState("");
  const [medals, setMedals] = useState([]);
  const [gameStats, setGameStats] = useState({});
  const [favoriteGame, setFavoriteGame] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [medals, stats] = await Promise.all([
          getUserMedals(user.firebase.uid),
          getUserGameStats(user.firebase.uid),
        ]);
        setMedals(medals);
        setGameStats(stats);

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
      /_easy|_medium|_hard|_very_hard|_impossible/,
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
        setGameStats(stats);

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
            <img
              src={`/avatars/${user?.profilePic}`}
              alt="Current Avatar"
              style={{ height: "80px", width: "80px", borderRadius: "50%" }}
            />
            <h1 style={{ margin: 0 }}>{user?.username || "Guest"}</h1>
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
              const imageSrc = "/trophies/trophy" + medal.rank + ".png";
              return (
                <div className="medal-item" key={i}>
                  <img src={imageSrc} className="medal-image" alt="Game" />
                  <div className="medal-label">
                    {formatGameName(medal.game_id, medal.difficulty)}
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
