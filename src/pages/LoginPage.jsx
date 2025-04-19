import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import "../styles/LoginPage.css";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { createUser, API_BASE_URL } from "../utils/api"; // ✅ Use your API wrapper

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

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // 🔐 Get Firebase token
      const token = await user.getIdToken();

      // 🔎 Try to get user info from your backend
      const res = await fetch(`${API_BASE_URL}/api/get_user_info`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 404) {
        // 🆕 Not found — create the user in your backend
        await createUser(
          user.displayName?.trim() || user.email.split("@")[0],
          user.email,
          token // Include token if your backend needs it
        );
      } else if (!res.ok) {
        throw new Error("Failed to fetch user info");
      }

      navigate("/profile");
    } catch (err) {
      console.error("❌ Google login error:", err.message);
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

      <button onClick={handleGoogleLogin} className="signup-button google-btn">
        Sign In with Google
      </button>

      <p className="login-redirect-text">
        Forgot your password?{" "}
        <a href="/#/forgot-password" className="login-link">
          Reset it here
        </a>
      </p>

      <p className="signup-text">
        Don’t have an account?{" "}
        <a href="/#/signup" className="signup-link">
          Sign up
        </a>
      </p>
    </div>
  );
}

export default LoginPage;
