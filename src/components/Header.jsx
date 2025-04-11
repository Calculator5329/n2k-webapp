import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../styles/Header.css";

function Header() {
  const { user, loading } = useAuth();

  if (loading) return null; // Optional: replace with a skeleton header if needed

  return (
    <header className="site-header">
      <div className="nav-left">
        <Link to="/" className="nav-link">
          Home
        </Link>
        <Link to="/play-written" className="nav-link">
          Play
        </Link>
      </div>
      <div className="nav-right">
        <Link to={user ? "/signout" : "/login"} className="nav-link">
          {user ? "Sign Out" : "Login"}
        </Link>
        <Link to="/profile" className="profile-link">
          <img
            src={`/${user?.profilePic || "profile.png"}`}
            alt="Profile"
            className="profile-icon"
          />
        </Link>
      </div>
    </header>
  );
}

export default Header;
