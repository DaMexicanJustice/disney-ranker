# 🎬 Disney Movie Ranker — Requirements (React + LocalStorage)

## 🧩 Overview
A mobile-first web app built with **React**.  
Purpose: manage and rank Disney movies with personal scores.  
Data is persisted **locally in the browser using LocalStorage**, so it works offline on Android devices.

---

## 🚀 Functional Requirements

### 1. Core Features
- **Add Movie**
  - Inputs: `title` (string), `rank` (integer 1–n), `score` (integer 1–10)
  - Prevent adding empty entries.
  - Automatically sort the list by rank after adding.

- **View Movie List**
  - Display as a ranked list: `"{rank}. {title} — {score}/10"`
  - Mobile-friendly display (touch-friendly, responsive).

- **Delete Movie**
  - Remove a movie by title with a delete button.
  - Confirm deletion optional.

- **Persistence**
  - Use **LocalStorage** key: `disneyMovies`.
  - Load movies from LocalStorage on app start.
  - Save automatically whenever the list changes.

---

## 💾 Data Model
```json
[
  { "title": "The Lion King", "rank": 1, "score": 10 },
  { "title": "Frozen", "rank": 2, "score": 8 }
]
```

---

## 🖥️ UI Layout

- **Inputs Section**
  - `TextInput` for movie title
  - `NumberInput` for rank (1–n)
  - `NumberInput` for score (1–10)
  - `Add Movie` button

- **Movies List Section**
  - Ordered list of movies by rank
  - Each movie shows: rank, title, score
  - `Delete` button for each movie

### Example Layout
```
[ Title Input       ]
[ Rank Input (1-n)  ]
[ Score Input (1-10)]
[ + Add Movie Button ]

1. The Lion King — 10/10   ❌
2. Frozen — 8/10           ❌
```

---

## ⚙️ Technical Stack

| Component | Technology |
|-----------|------------|
| Frontend | React 18+ |
| Styling | Inline styles or CSS modules |
| Persistence | LocalStorage (key: `disneyMovies`) |
| Target Device | Android mobile browser |
| Optional | Turn into PWA for home-screen installation |

---

## 🧠 Future Enhancements
- Edit existing movie entries
- Sort by score or alphabetically
- Export/import JSON
- Add visual star ratings
- Offline installation as a full PWA with service worker

---

## ✅ Definition of Done
- User can:
  - Add, delete, and view Disney movies
  - See movies ranked correctly by rank
  - Data persists between sessions in LocalStorage
- Works fully offline on Android browser
- UI is mobile-friendly and touch-friendly

---

## 📁 Project Structure

```
disney-ranker/
├── public/
│   └── index.html
├── src/
│   ├── App.js       # Main React app
│   └── index.js     # React DOM entry
├── package.json
└── README.md
```

---

## 🪄 Developer Notes
- Movies list stored in `LocalStorage` key `disneyMovies`.
- Sort movies by rank after any add/delete operation.
- Validate inputs: rank ≥ 1, score 1–10, title non-empty.
- Ensure mobile-friendly layout: responsive widths, touch-friendly buttons.
- Optional: style list with CSS for readability on small screens.
