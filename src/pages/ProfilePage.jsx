import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { updateProfilePic } from "../utils/api";
import "../styles/ProfilePage.css";

const presetAvatars = Array.from(
  { length: 20 },
  (_, i) => `avatar${i + 1}.png`
);

function ProfilePage() {
  const { user, refreshUserInfo } = useAuth();
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState("");

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

      <div className="info-container">
        <div className="username-header">
          <img
            src={`/avatars/${user?.profilePic}`}
            alt="Current Avatar"
            style={{
              height: "80px",
              width: "80px",
              borderRadius: "50%",
              marginTop: "0rem",
            }}
          />
          <h1 style={{ margin: 0, textAlign: "center" }}>
            {user?.username || "Guest"}
          </h1>
        </div>
        <table className="user-info-table">
          <tbody>
            <tr>
              <td className="label">Email:</td>
              <td>{user?.firebase?.email || "N/A"}</td>
            </tr>
            <tr>
              <td className="label">Avatar:</td>
              <td>{user?.profilePic || "Not set"}</td>
            </tr>
            <tr>
              <td className="label">Bio:</td>
              <td>Coming soon...</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProfilePage;
