# Mental Math Web App

A fast, interactive mental math web app designed to help users practice problem solving with numbers through fun and challenging minigames.

Built with a **React frontend**, **FastAPI backend**, **Firebase Auth**, and **PostgreSQL** for storing user data and scores. Deployed with **Cloudflare Tunnels** and **GitHub Pages**.

🔗 **Live Site**: [mentalmath.site](https://mentalmath.site)

---

## ⚙️ Features

### 🎯 **Board Slam**
- Use 3 dice (1–19) to create equations using `+`, `-`, `×`, `÷`, and **exponents**.
- Match the result to numbers on the board.
- Includes multiple board types:
  - **Classic 1–36**
  - **Multiples (2s, 6s, 7s, etc.)**
- Equations must use all 3 dice and follow **PEMDAS** rules.
- 1-minute timed rounds to score as many matches as possible.

### ✍️ **Written Problems**
- Solve algebra-style equations like `x^0 * y^1 * z^3 = 40`.
- Choose values from 1–9 to solve each one.
- Problems are sorted by difficulty from **Easy** to **Impossible**.

### 🧑‍🚀 **User Profiles & Medals**
- Choose from 24+ avatars.
- Track:
  - Games played
  - Favorite mode
  - Medals earned (Gold, Silver, Bronze)
- Medals are awarded per board type and difficulty.

### 📊 **Leaderboards**
- View top scores for each board and written mode.
- Logged-in users can submit scores to be ranked.

### 📘 **How to Play**
- Clean, simple instructions for both game types.
- Shows dice usage, valid operations, example equations, and game flow.

---

## 🛠 Tech Stack

| Layer        | Tech Stack                              |
|--------------|------------------------------------------|
| Frontend     | React, React Router, CSS Modules         |
| Backend      | FastAPI (Python)                         |
| Auth         | Firebase Authentication                  |
| Database     | PostgreSQL (SQLAlchemy ORM)              |
| Hosting      | GitHub Pages (Frontend), Cloudflare Tunnels (Backend) |

---

## 🖼 Screenshots

### Game Selection Page
![Game Selection](./screenshots/Screenshot%202025-04-19%20182026.png)

### How to Play – Board Slam
![How to Play](./screenshots/Screenshot%202025-04-19%20182038.png)

### Profile & Medals
![Profile](./screenshots/Screenshot%202025-04-19%20182104.png)

### Welcome Page
![Homepage](./screenshots/Screenshot%202025-04-19%20182115.png)

### Board Slam Gameplay
![Board Slam](./screenshots/Screenshot%202025-04-19%20182135.png)

### Written Problems Gameplay
![Written Problems](./screenshots/Screenshot%202025-04-19%20182147.png)

---

## 🚧 Future Plans

- Add **multiplayer challenges** (e.g. live duels or async score battles)
- Introduce **new board patterns** (hex, spiral, random layouts)
- Add **more problem generators** (fractions, decimals, logic puzzles)
