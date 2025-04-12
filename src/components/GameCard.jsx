// src/components/GameCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../styles/GameCard.css";

export default function GameCard({ title, image, description, link }) {
  return (
    <div className="game-card">
      <img src={image} alt={title} className="game-image" />
      <div className="game-info">
        <h3 className="game-title">{title}</h3>
        <p className="game-description">{description}</p>
        <Link to={link} className="game-button">
          Play
        </Link>
      </div>
    </div>
  );
}
