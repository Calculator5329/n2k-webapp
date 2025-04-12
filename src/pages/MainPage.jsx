import { React, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import "../styles/MainPage.css";
import GameCard from "../components/GameCard";

function MainPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="center-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  if (loading) return null; // or a fancy spinner

  return user ? <LoggedInLayout /> : <GuestLayout />;
}

function LoggedInLayout() {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="main-page app-container-mp">
      <div className="card-container">
        <GameCard
          title="Board Slam Classic"
          image="/boards/boardx1.png"
          description="The classic 1-36 board! A great place to start."
          link="/play?pattern=1"
        />
        <GameCard
          title="Board Slam - 2s"
          image="/boards/boardx2.png"
          description="This board counts by 2s up to 72."
          link="/play?pattern=2"
        />
        <GameCard
          title="Board Slam - 3s"
          image="/boards/boardx3.png"
          description="This board counts by 3s up to 108."
          link="/play?pattern=3"
        />
        <GameCard
          title="Written Problems - Easy"
          image="/written/written_easy.png"
          description="Written problems with difficulty levels from 0–10."
          link="/play-written?difficulty=easy"
        />
        <GameCard
          title="Written Problems - Medium"
          image="/written/written_medium.png"
          description="Written problems with difficulty levels from 10–25."
          link="/play-written?difficulty=medium"
        />
        <GameCard
          title="Written Problems - Hard"
          image="/written/written_hard.png"
          description="Written problems with difficulty levels from 25–40."
          link="/play-written?difficulty=hard"
        />

        {showMore && (
          <>
            <GameCard
              title="Board Slam – 4s"
              image="/boards/boardx4.png"
              description="Practice 4s up to 144."
              link="/play?pattern=4"
            />
            <GameCard
              title="Board Slam – 5s"
              image="/boards/boardx5.png"
              description="A great jump into mid-range values."
              link="/play?pattern=5"
            />
            <GameCard
              title="Board Slam – 6s"
              image="/boards/boardx6.png"
              description="A great jump into mid-range values."
              link="/play?pattern=6"
            />
            <GameCard
              title="Board Slam – 7s"
              image="/boards/boardx7.png"
              description="A great jump into mid-range values."
              link="/play?pattern=7"
            />
            <GameCard
              title="Board Slam – 8s"
              image="/boards/boardx8.png"
              description="A great jump into mid-range values."
              link="/play?pattern=8"
            />
            <GameCard
              title="Board Slam – 9s"
              image="/boards/boardx9.png"
              description="A great jump into mid-range values."
              link="/play?pattern=9"
            />
            <GameCard
              title="Written Problems – Very Hard"
              image="/written/written_very_hard.png"
              description="Written problems difficulty 40–60."
              link="/play-written?difficulty=very hard"
            />
            <GameCard
              title="Written Problems – Impossible"
              image="/written/written_impossible.png"
              description="Insane difficulty problems 60+."
              link="/play-written?difficulty=impossible"
            />
          </>
        )}
      </div>

      <div className="see-more-container">
        <button className="btn-see-more" onClick={() => setShowMore(!showMore)}>
          {showMore ? "See Less" : "See More"}
        </button>
      </div>
    </div>
  );
}
function GuestLayout() {
  return (
    <div className="main-page app-container-mp">
      <div className="intro-section">
        <h1>Welcome!</h1>
        <p style={{ fontSize: "1.25rem" }}>
          This site aims to help you practice your math skills with 2 fun mental
          math games. Feel free to try them out as a guest, or sign up to save
          your scores and track your progress.
        </p>
      </div>
      <Link to="/howtoplay" className="btn-learn btn-play">
        Learn How to Play
      </Link>

      <section className="game-section">
        <h2>🎲 Board Slam</h2>
        <p>
          Choose numbers and raise them to powers to match targets on the board.
          You'll get three dice. Your job? Combine them smartly using +, –, ×,
          or ÷.
        </p>
        <p>
          Example: <code>2^2 + 3^1 + 1 = 8</code> — if 8 is on the board, you
          score!
        </p>
        <div className="button-row">
          <Link to="/practice?pattern=1&demo=true" className="btn-play">
            Try Board Slam
          </Link>
        </div>
      </section>

      <section className="game-section">
        <h2>✍️ Written Problems</h2>
        <p>
          We'll give you an equation like: <code>x^2 + y^1 * z^3 = 125</code>.
          You pick the numbers for x, y, and z. You can use any numbers from
          1-19.
        </p>
        <p>
          It's fast-paced problem solving, and you can always level up the
          difficulty level if it gets too easy!
        </p>
        <div className="button-row">
          <Link
            to="/play-written?difficulty=easy&demo=true"
            className="btn-play"
          >
            Try Written Problems
          </Link>
        </div>
      </section>
    </div>
  );
}

export default MainPage;
