import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { updateProfilePic } from "../utils/api";
import "../styles/ProfilePage.css";

const presetAvatars = [
  "avatar1.png",
  "avatar2.png",
  "avatar3.png",
  "avatar4.png",
];

function ProfilePage() {
  const { user, refreshUserInfo } = useAuth();
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    try {
      await updateProfilePic(selected);
      await refreshUserInfo(user.firebase); // ✅ no full reload
      setMessage("✅ Updated!");
    } catch (err) {
      console.error("❌ Failed to update:", err.message);
      setMessage("❌ Failed to update");
    }
  };

  return (
    <div className="profile-page">
      <h1>Choose Your Avatar</h1>
      <div className="avatar-grid">
        {presetAvatars.map((avatar) => (
          <img
            key={avatar}
            src={`/${avatar}`}
            alt={avatar}
            className={`avatar-option ${selected === avatar ? "selected" : ""}`}
            onClick={() => setSelected(avatar)}
          />
        ))}
      </div>
      <button onClick={handleSubmit} disabled={!selected}>
        Save Avatar
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default ProfilePage;
