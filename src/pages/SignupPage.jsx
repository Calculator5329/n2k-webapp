import React, { useState } from "react";
import Header from "../components/Header";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { createUser } from "../utils/api"; // ✅ Use your API wrapper
import "../styles/SignupPage.css";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleGoogleSignup = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const name = user.displayName?.trim() || user.email.split("@")[0];
      await createUser(name, user.email);

      navigate("/profile");
    } catch (err) {
      console.error("❌ Google signup error:", err.message);
      setError(err.message);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      // ✅ Sign up with Firebase
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      console.log("✅ Firebase user:", userCred.user);

      // ✅ Sync user to backend DB
      await createUser(username, email);

      console.log("✅ Signup and DB creation successful");
      navigate("/profile");
    } catch (err) {
      console.error("❌ Signup error:", err.message);
      setError(err.message);
    }
  };

  return (
    <div className="main-container">
      <Header />
      <div className="app-container signup-page-container">
        <h1 className="signup-title">Create Account</h1>

        <form className="signup-form" onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Username"
            className="signup-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="signup-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="signup-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="signup-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit" className="signup-button">
            Sign Up
          </button>
        </form>

        {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}

        <button
          onClick={handleGoogleSignup}
          className="signup-button google-btn"
        >
          Sign Up with Google
        </button>

        <p className="login-redirect-text">
          Already have an account?{" "}
          <a href="/login" className="login-link">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;
