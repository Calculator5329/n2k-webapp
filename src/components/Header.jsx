import React from "react";
import { Link } from "react-router-dom";
import "../styles/Header.css"; // We'll style it here

function Header() {
  return (
    <header className="site-header">
      <div className="nav-left">
        <Link to="/" className="nav-link">
          Home
        </Link>
        <Link to="/play" className="nav-link">
          Play
        </Link>
      </div>
      <div className="nav-right">
        <Link to="/login" className="nav-link">
          Login
        </Link>
        <Link to="/profile" className="profile-link">
          <img src="/profile.png" alt="Profile" className="profile-icon" />
        </Link>
      </div>
    </header>
  );
}

export default Header;
