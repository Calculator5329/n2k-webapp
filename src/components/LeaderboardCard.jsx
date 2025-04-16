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
  const lowerTitle = title.toLowerCase();
  const isWritten = lowerTitle.includes("written");
  // Extract level from title if present, fallback to 'easy'
  const level = DIFFICULTIES.find((lvl) => lowerTitle.includes(lvl)) || "easy";

  return (
    <div className="game-card">
      {isWritten ? (
        <img
          src={`${import.meta.env.BASE_URL}` + image}
          alt={title}
          className="game-image-written"
        />
      ) : (
        <img
          src={`${import.meta.env.BASE_URL}` + image}
          alt={title}
          className="game-image"
        />
      )}
      <div className="game-info">
        <h3 className="game-title">{title}</h3>
        <p className="game-description">{description}</p>
        <div className="game-footer">
          {isWritten ? (
            <button
              className="game-button"
              onClick={() => onSelect(gameId, level)}
              style={{
                margin: "2px",
                fontSize: "0.8rem",
              }}
            >
              Scoreboard
            </button>
          ) : (
            DIFFICULTIES.map((lvl) => (
              <button
                key={lvl}
                className="game-button"
                onClick={() => onSelect(gameId, lvl)}
                style={{
                  margin: "2px",
                  fontSize: "0.8rem",
                }}
              >
                {lvl}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
