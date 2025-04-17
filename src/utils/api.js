import { auth } from "../firebase";

export const API_BASE_URL = "https://n2k-backend-production.up.railway.app";

// 🔒 Ensures single slash between base and path
function buildURL(path) {
  return `${API_BASE_URL.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
}

async function getAuthToken() {
  const user = auth.currentUser;
  if (!user) throw new Error("User not logged in");
  return await user.getIdToken();
}

export async function createUser(username, email) {
  const token = await getAuthToken();

  const response = await fetch(buildURL("api/create_user"), {
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

export async function getUserStats() {
  const token = await getAuthToken();

  const res = await fetch(buildURL("api/get_user_stats"), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch user stats");
  return await res.json();
}

export async function updateProfilePic(filename) {
  const token = await getAuthToken();

  const res = await fetch(buildURL("api/update_profile_pic"), {
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
  const token = await getAuthToken();

  const res = await fetch(buildURL("api/get_user_info"), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch user info");
  return await res.json();
}

export async function fetchScores(gameId, difficulty = null) {
  const token = await getAuthToken();
  const url = buildURL(
    difficulty
      ? `scores/${gameId}?difficulty=${difficulty}`
      : `scores/${gameId}`
  );

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

  const res = await fetch(buildURL(`scores/${gameId}`), {
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

  await fetch(buildURL("update_game_stats"), {
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

  const res = await fetch(buildURL(`get_user_game_stats/${userId}`), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch game stats");
  return await res.json();
}

export async function getUserMedals(userId) {
  const res = await fetch(buildURL(`users/${userId}/medals`));
  if (!res.ok) throw new Error("Failed to fetch medals");
  return await res.json();
}
