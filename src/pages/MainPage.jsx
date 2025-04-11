import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import "../styles/MainPage.css";

function MainPage() {
  const { user, loading } = useAuth();

  if (loading) return null; // or a fancy spinner

  return user ? <LoggedInLayout /> : <GuestLayout />;
}

function LoggedInLayout() {
  return (
    <div className="main-page app-container-mp">
      <section className="game-section">
        <h2>Board Slam</h2>
        <p>
          Use exponent dice and logic to match the board. Can you beat the
          leaderboard?
        </p>
        <div className="button-row">
          <Link to="/play" className="btn-play">
            Play Board Slam
          </Link>
        </div>
      </section>

      <section className="game-section">
        <h2>Written Problems</h2>
        <p>
          Solve exponent-based equations as fast as you can. Choose your
          difficulty. Go!
        </p>
        <div className="button-row">
          <Link to="/play-written" className="btn-play">
            Play Written
          </Link>
        </div>
      </section>

      <div style={{ marginBottom: "5rem" }}></div>

      <LearnSection />
    </div>
  );
}

function GuestLayout() {
  return (
    <div className="main-page app-container-mp">
      <div className="learn-section-link">
        <a href="#learn" className="btn-learn btn-play">
          Learn to Play
        </a>
      </div>
      <section className="game-section">
        <h2>Board Slam</h2>
        <p>
          Use exponent dice and logic to match the board. Can you beat the
          leaderboard?
        </p>
        <div className="button-row">
          <Link to="/play?demo=true" className="btn-play">
            Try it Out
          </Link>
        </div>
      </section>

      <section className="game-section">
        <h2>Written Problems</h2>
        <p>
          Solve exponent-based equations as fast as you can. Choose your
          difficulty. Go!
        </p>
        <div className="button-row">
          <Link to="/play-written?demo=true" className="btn-play">
            Try it Out
          </Link>
        </div>
      </section>

      <div style={{ marginBottom: "5rem" }}></div>

      <LearnSection />
    </div>
  );
}

function LearnSection() {
  return (
    <>
      <section className="learn-section" id="learn">
        <h2>How to Play</h2>
        <div className="learn-block">
          <h3>Board Slam</h3>
          <p>
            You’re given 3 dice and a board of numbers. Raise each die to a
            power (0–3), combine them with +, –, ×, or ÷, and try to match the
            board values. Solve as many as you can before time runs out.
          </p>
        </div>
        <div className="learn-block">
          <h3>Written Problems</h3>
          <p>
            You’ll see an equation like x<sup>2</sup> + y<sup>1</sup> * z
            <sup>3</sup> = 125. Your job? Pick base values for x, y, and z.
            There’s only one combo that works — and you’ve got 10 problems to
            beat as fast as possible.
          </p>
        </div>
      </section>
    </>
  );
}

export default MainPage;
