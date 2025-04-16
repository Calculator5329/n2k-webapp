import { auth } from "../firebase";

export const API_BASE_URL = "http://localhost:8000";

async function getAuthToken() {
  const user = auth.currentUser;
  if (!user) throw new Error("User not logged in");
  return await user.getIdToken();
}

export async function createUser(username, email) {
  const token = await getAuthToken();

  const response = await fetch(`${API_BASE_URL}/api/create_user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ username, email }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.detail || "Failed to create user");
  }

  return await response.json();
}

// You can add more here later, like:
export async function getUserStats() {
  const token = await getAuthToken();

  const res = await fetch(`${API_BASE_URL}/api/get_user_stats`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch user stats");
  }

  return await res.json();
}
export async function updateProfilePic(filename) {
  const token = await getAuthToken();

  const res = await fetch(`${API_BASE_URL}/api/update_profile_pic`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ profile_pic: filename }),
  });

  if (!res.ok) throw new Error("Failed to update profile pic");
}

export async function getUserInfo() {
  const token = await getAuthToken(); // fetch the auth token here

  const res = await fetch(`${API_BASE_URL}/api/get_user_info`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch user info");
  return await res.json();
}

export async function fetchScores(gameId, difficulty = null) {
  const token = await getAuthToken();
  console.log(difficulty);
  const url = difficulty
    ? `${API_BASE_URL}/scores/${gameId}?difficulty=${difficulty}`
    : `${API_BASE_URL}/scores/${gameId}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch scores");
  return await res.json();
}

export async function submitScore(
  gameId,
  { user_id, username, score, difficulty }
) {
  const token = await getAuthToken();

  const res = await fetch(`${API_BASE_URL}/scores/${gameId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user_id, username, score, difficulty }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to submit score");
  }

  return await res.json();
}
export async function updateGameStats(userId, gameId) {
  const token = await getAuthToken();

  await fetch(`${API_BASE_URL}/update_game_stats`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user_id: userId, game_id: gameId }),
  });
}

export async function getUserGameStats(userId) {
  const token = await getAuthToken();
  const res = await fetch(`${API_BASE_URL}/get_user_game_stats/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch game stats");
  return await res.json(); // { pattern1: 5, written_easy: 3, ... }
}
export async function getUserMedals(userId) {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/medals`);
  if (!response.ok) throw new Error("Failed to fetch medals");
  return response.json();
}
