import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import MainPage from "./pages/MainPage";
import GamePage from "./pages/GamePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import SignoutPage from "./pages/SignoutPage";
import ProfilePage from "./pages/ProfilePage";
import WrittenProblemsPage from "./pages/WrittenProblemsPage";

function App() {
  return (
    <div className="main-container">
      <Header />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/play" element={<GamePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/signout" element={<SignoutPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/play-written" element={<WrittenProblemsPage />} />
        {/* Add more routes later */}
      </Routes>
    </div>
  );
}

export default App;
