// src/components/GameCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../styles/GameCard.css";

export default function GameCard({ title, image, description, link, played }) {
  return (
    <div className="game-card">
      <img
        src={`${import.meta.env.BASE_URL}` + image}
        alt={title}
        className="game-image"
      />
      <div className="game-info">
        <h3 className="game-title">{title}</h3>
        <p className="game-description">{description}</p>
        <div className="game-footer">
          <Link to={link} className="game-button">
            Play
          </Link>
          {played !== undefined && (
            <div className="played-text">
              Played {played} time{played !== 1 && "s"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
