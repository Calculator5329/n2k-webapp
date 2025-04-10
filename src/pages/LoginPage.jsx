import React from "react";
import Header from "../components/Header";

function LoginPage() {
  return (
    <div className="main-container">
      <Header />
      <div
        className="app-container"
        style={{ textAlign: "center", paddingTop: "2rem" }}
      >
        <h1>Login Page</h1>
        <p>This is where your login form will go.</p>
        {/* Add a real login form later */}
      </div>
    </div>
  );
}

export default LoginPage;
