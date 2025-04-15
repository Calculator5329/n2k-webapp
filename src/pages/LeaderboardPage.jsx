import React, { useState } from "react";
import "../styles/LeaderboardPage.css";
import { useAuth } from "../contexts/AuthContext";
import Scoreboard from "../components/Scoreboard";
import LeaderboardCard from "../components/LeaderboardCard";

const leaderboardGames = [
  {
    title: "Board Slam Classic",
    image: "/boards/boardx1.png",
    description: "The classic 1-36 board! A great place to start.",
    link: "/play?pattern=1",
    id: "pattern1",
  },
  {
    title: "Board Slam - 2s",
    image: "/boards/boardx2.png",
    description: "This board counts by 2s up to 72.",
    link: "/play?pattern=2",
    id: "pattern2",
  },
  {
    title: "Board Slam - 3s",
    image: "/boards/boardx3.png",
    description: "This board counts by 3s up to 108.",
    link: "/play?pattern=3",
    id: "pattern3",
  },
  {
    title: "Written Problems - Easy",
    image: "/written/written_easy.png",
    description: "Written problems with difficulty levels from 0–10.",
    link: "/play-written?difficulty=easy",
    id: "written_easy",
  },
  {
    title: "Written Problems - Medium",
    image: "/written/written_medium.png",
    description: "Written problems with difficulty levels from 10–25.",
    link: "/play-written?difficulty=medium",
    id: "written_medium",
  },
  {
    title: "Written Problems - Hard",
    image: "/written/written_hard.png",
    description: "Written problems with difficulty levels from 25–40.",
    link: "/play-written?difficulty=hard",
    id: "written_hard",
  },
  {
    title: "Board Slam – 4s",
    image: "/boards/boardx4.png",
    description: "Practice 4s up to 144.",
    link: "/play?pattern=4",
    id: "pattern4",
  },
  {
    title: "Board Slam – 5s",
    image: "/boards/boardx5.png",
    description: "A great jump into mid-range values.",
    link: "/play?pattern=5",
    id: "pattern5",
  },
  {
    title: "Board Slam – 6s",
    image: "/boards/boardx6.png",
    description: "A great jump into mid-range values.",
    link: "/play?pattern=6",
    id: "pattern6",
  },
  {
    title: "Board Slam – 7s",
    image: "/boards/boardx7.png",
    description: "A great jump into mid-range values.",
    link: "/play?pattern=7",
    id: "pattern7",
  },
  {
    title: "Board Slam – 8s",
    image: "/boards/boardx8.png",
    description: "A great jump into mid-range values.",
    link: "/play?pattern=8",
    id: "pattern8",
  },
  {
    title: "Board Slam – 9s",
    image: "/boards/boardx9.png",
    description: "A great jump into mid-range values.",
    link: "/play?pattern=9",
    id: "pattern9",
  },
  {
    title: "Written Problems – Very Hard",
    image: "/written/written_very_hard.png",
    description: "Written problems difficulty 40–60.",
    link: "/play-written?difficulty=very hard",
    id: "written_very_hard",
  },
  {
    title: "Written Problems – Impossible",
    image: "/written/written_impossible.png",
    description: "Insane difficulty problems 60+.",
    link: "/play-written?difficulty=impossible",
    id: "written_impossible",
  },
];

function LeaderboardPage() {
  const { user, loading } = useAuth();
  const [selectedGame, setSelectedGame] = useState(null);

  if (loading) {
    return <div className="leaderboard-container">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="leaderboard-container">
        Please log in to view the leaderboard.
      </div>
    );
  }

  const userId = user.firebase.uid;
  const username = user.username;

  return (
    <div className="leaderboard-container">
      <h1>📊 Leaderboards</h1>

      <div className="leaderboard-cards">
        {leaderboardGames.map((game) => (
          <LeaderboardCard
            key={game["id"]}
            title={game.title}
            image={game.image}
            description={game.description}
            gameId={game.id}
            onSelect={(gameId, difficulty) =>
              setSelectedGame({ gameId, difficulty })
            }
          />
        ))}
      </div>

      {selectedGame && (
        <Scoreboard
          gameId={selectedGame.gameId}
          difficulty={selectedGame.difficulty}
          userScore={null}
          username={username}
          userId={userId}
          visible={true}
          onClose={() => setSelectedGame(null)}
        />
      )}
    </div>
  );
}

export default LeaderboardPage;
