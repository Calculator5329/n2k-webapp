import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import "../styles/LoginPage.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("✅ Logged in");
      navigate("/"); // or redirect to /profile if you prefer
    } catch (err) {
      console.error("❌ Login error:", err.message);
      setError(err.message);
    }
  };

  return (
    <div className="app-container login-page-container">
      <h1 className="login-title">Login</h1>

      <form className="login-form" onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          className="login-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="login-button">
          Sign In
        </button>
      </form>

      {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}

      <p className="signup-text">
        Don’t have an account?{" "}
        <a href="/signup" className="signup-link">
          Sign up
        </a>
      </p>
    </div>
  );
}

export default LoginPage;
