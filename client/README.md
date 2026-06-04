# TaskFlow

> **Studio Graphene — Full Stack Developer Assessment | Exercise 1: Personal Task Manager**

A clean, Notion-inspired monochrome task manager. Users can create, view, update, and delete personal tasks — with filtering by status, debounced search, overdue indicators, and a live progress strip. Built with Node.js + Express on the backend and React + Tailwind CSS on the frontend, with MongoDB for persistence.

---

## Live Demo

>Live Demo Link: https://taskify-ruddy-iota.vercel.app/

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Backend | Node.js + Express | Minimal, well-documented, easy to structure |
| Database | MongoDB + Mongoose | Flexible schema, free Atlas tier for deployment |
| Frontend | React + Vite | Fast dev server, modern tooling, no CRA bloat |
| Styling | Tailwind CSS + CSS variables | Utility classes for layout, custom tokens for the design system |
| HTTP | Axios | Clean API, response interceptors for global error handling |

---

## How to Run Locally

> Prerequisites: **Node.js v18+** and a MongoDB instance (local or [Atlas free tier](https://cloud.mongodb.com)).

### 1. Clone the repository

```bash
git clone https://github.com/PragyaMaheshwari14/Taskify
cd taskflow
```

### 2. Backend setup

```bash
cd server
cp .env.example .env
# Open .env and set your MONGO_URI
npm install
npm run dev
# → 🚀 Server running on http://localhost:5000
# → ✅ MongoDB connected
```

### 3. Frontend setup

```bash
cd ../client
npm install
npm run dev
# → http://localhost:5173
```

Both servers must be running. The Vite dev proxy forwards `/api` requests from the frontend to `localhost:5000` automatically — no manual CORS setup needed during development.

---

## API Documentation

Base URL (local): `http://localhost:5000/api`

### Health Check

| Method | Path | Response |
|---|---|---|
| `GET` | `/health` | `{ status: "ok", timestamp }` |

### Tasks

#### `GET /tasks`

Returns all tasks sorted by `createdAt` descending (newest first).

**Query params:**

| Param | Type | Description |
|---|---|---|
| `status` | `all` \| `active` \| `completed` | Filter by completion status |
| `search` | string | Case-insensitive title match |

**Response:**
```json
{
  "success": true,
  "count": 3,
  "meta": { "totalActive": 2, "totalCompleted": 1 },
  "data": [ ...tasks ]
}
```

#### `GET /tasks/:id`

**Response:** `{ "success": true, "data": task }`

#### `POST /tasks`

**Body:**
```json
{
  "title": "Buy groceries",
  "description": "Milk and eggs",
  "dueDate": "2025-06-10"
}
```
`title` is required. `description` and `dueDate` are optional.

**Response:** `201` — `{ "success": true, "data": task }`

#### `PUT /tasks/:id`

Update `title`, `description`, and/or `dueDate`. All fields optional.

**Response:** `{ "success": true, "data": updatedTask }`

#### `PATCH /tasks/:id/toggle`

Toggles `completed` between `true` and `false`.

**Response:** `{ "success": true, "data": updatedTask }`

#### `DELETE /tasks/:id`

**Response:** `{ "success": true, "data": { "id": "..." } }`

### Task object shape

```json
{
  "_id": "664abc123...",
  "title": "Buy groceries",
  "description": "Milk and eggs",
  "dueDate": "2025-06-10T00:00:00.000Z",
  "completed": false,
  "isOverdue": false,
  "createdAt": "2025-06-02T10:00:00.000Z",
  "updatedAt": "2025-06-02T10:00:00.000Z"
}
```

`isOverdue` is a virtual field — `true` when `dueDate` is in the past and the task is not complete.

---

## Project Structure

```
taskflow/
├── client/                        # React frontend (Vite)
│   ├── index.html                 # Viewport meta, root div
│   ├── vite.config.js             # Vite + Tailwind + dev proxy
│   └── src/
│       ├── api/
│       │   └── tasks.js           # All Axios calls in one place
│       ├── hooks/
│       │   ├── useTasks.js        # Task state + all CRUD operations
│       │   └── useDebounce.js     # Delays search API call until typing pauses
│       ├── components/
│       │   ├── TaskForm.jsx       # Collapsible add-task form
│       │   ├── TaskList.jsx       # List container, delegates to TaskItem
│       │   ├── TaskItem.jsx       # Single row — view / inline edit / delete
│       │   ├── FilterBar.jsx      # Status tabs + debounced search input
│       │   ├── TaskCounter.jsx    # Active vs completed progress strip
│       │   ├── DeleteConfirm.jsx  # Confirmation modal
│       │   └── EmptyState.jsx     # Empty state UI
│       ├── App.jsx                # Root — owns filter state, wires everything
│       ├── main.jsx               # React entry point
│       └── index.css              # Tailwind + CSS design tokens + mobile rules
│
├── server/                        # Express backend
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   └── taskController.js      # CRUD logic, query filtering
│   ├── middleware/
│   │   └── errorHandler.js        # Global error handler
│   ├── models/
│   │   └── Task.js                # Mongoose schema + isOverdue virtual
│   ├── routes/
│   │   └── tasks.js               # Route definitions
│   ├── .env.example
│   └── index.js                   # Server entry point + CORS config
│
├── .gitignore
├── package.json                   # Root convenience scripts
└── README.md
```

---

## What Works

- [x] Express server with CORS (dev + production)
- [x] MongoDB + Mongoose connection
- [x] Task model with `isOverdue` virtual field
- [x] Full CRUD REST API (GET, POST, PUT, PATCH, DELETE)
- [x] Status filter and title search via query params
- [x] Global error handler (Mongoose errors, CastError, 404s)
- [x] React + Vite + Tailwind CSS scaffold
- [x] Axios service with response interceptors
- [x] `useTasks` hook — all state and operations in one place
- [x] `useDebounce` hook — search fires API only after typing pauses
- [x] Collapsible add-task form (title required, description + due date optional)
- [x] Task list sorted newest first
- [x] Inline edit mode per task row
- [x] Delete with confirmation modal (closes on Escape / backdrop click)
- [x] Toggle complete / incomplete (checkbox)
- [x] Overdue badge — warm amber indicator on past-due incomplete tasks
- [x] Filter tabs — All / Active / Completed
- [x] Debounced search — results update 350ms after typing stops
- [x] Active vs completed count in header
- [x] Progress strip with animated bar ("all done ✦" when 100%)
- [x] Loading skeletons while fetching
- [x] Error banner on API failures
- [x] Empty state UI (different messages for no tasks vs no results)
- [x] Mobile responsive — clamp padding, touch-friendly tap targets, action buttons always visible on touch devices

## Next Steps (given more time)

- **Persistence on server restart** — tasks already persist in MongoDB; this is done. With SQLite, a JSON file option would also be easy to add.
- **Drag-and-drop reorder** — the `order` field is already on the Task model; adding `@dnd-kit/core` would wire it up.
- **Optimistic UI rollback** — currently if an API call fails after an optimistic update the state can get out of sync. Adding a rollback on error would fix this.
- **Tests** — a couple of Vitest/Supertest tests on the `/api/tasks` endpoints would cover the core happy paths.
- **Pagination** — for large task lists, cursor-based pagination on the GET endpoint would keep responses fast.

---

> AI tools (Claude) were used to assist with boilerplate and component structure. All code has been reviewed and is understood by the author.
