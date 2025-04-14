import { auth } from "../firebase";

const API_BASE_URL = "http://localhost:8000";

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

export async function getUserInfo(token) {
  const res = await fetch(`${API_BASE_URL}/api/get_user_info`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch user info");
  return await res.json();
}
export async function fetchScores(gameId) {
  const token = await getAuthToken();

  const res = await fetch(`${API_BASE_URL}/scores/${gameId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch scores");
  return await res.json();
}

export async function submitScore(gameId, { user_id, username, score }) {
  const token = await getAuthToken();

  const res = await fetch(`${API_BASE_URL}/scores/${gameId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user_id, username, score }),
  });

  if (!res.ok) {
    const text = await res.text(); // might be plain error
    throw new Error(text || "Failed to submit score");
  }

  return await res.json();
}
