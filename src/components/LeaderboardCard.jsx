// src/components/LeaderboardCard.jsx
import React from "react";
import "../styles/GameCard.css"; // reusing same styles

const DIFFICULTIES = ["easy", "medium", "hard", "very hard", "impossible"];

export default function LeaderboardCard({
  title,
  image,
  description,
  gameId,
  onSelect,
}) {
  return (
    <div className="game-card">
      <img src={image} alt={title} className="game-image" />
      <div className="game-info">
        <h3 className="game-title">{title}</h3>
        <p className="game-description">{description}</p>
        <div className="game-footer">
          {DIFFICULTIES.map((level) => (
            <button
              key={level}
              className="game-button"
              onClick={() => onSelect(gameId, level)}
              style={{ margin: "2px", fontSize: "0.8rem" }}
            >
              {level}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
