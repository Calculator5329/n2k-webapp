import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent! Check your inbox.");
    } catch (err) {
      console.error("❌ Reset error:", err.message);
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="main-container">
      <div className="app-container signup-page-container">
        <h1>Reset Password</h1>
        <form onSubmit={handleReset}>
          <input
            type="email"
            className="signup-input"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            className="signup-button"
            type="submit"
            style={{ marginLeft: "20px" }}
          >
            Send Reset Link
          </button>
        </form>
        {message && <p style={{ marginTop: "1rem" }}>{message}</p>}
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
