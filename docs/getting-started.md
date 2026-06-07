# Getting Started

This guide walks you through cloning, installing, and running GitFox locally.

---

## Prerequisites

| Requirement | Minimum Version | Notes |
|---|---|---|
| Node.js | 18.x | Required by both backend and frontend |
| npm | 9.x | Bundled with Node 18 |
| Git | any | For cloning |

---

## 1. Clone the Repository

```bash
git clone https://github.com/your-username/git-fox.git
cd git-fox
```

---

## 2. Install Dependencies

Each package (`backend`, `frontend`) has its own `node_modules`. Install them separately:

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

---

## 3. Configure Environment Variables

### Backend

```bash
cp backend/.env.example backend/.env
```

Open `backend/.env` and fill in values:

```dotenv
PORT=3001
GITHUB_TOKEN=          # optional but recommended (see note below)
CACHE_TTL=60           # seconds
FRONTEND_URL=*         # CORS origin — set to your Vercel URL in production
```

> **GitHub Token Note**  
> Without a token, the GitHub API allows **60 requests/hour** per IP.  
> With a Personal Access Token (no scopes needed), the limit rises to **5,000 requests/hour**.  
> Create one at [github.com/settings/tokens](https://github.com/settings/tokens).

### Frontend

The frontend `.env` is only needed for **production** deployments.  
In development, Vite's dev-server proxy forwards `/api/*` to `localhost:3001` automatically.

```bash
cp frontend/.env.example frontend/.env
# Leave VITE_API_BASE_URL empty for local development
```

---

## 4. Run Locally

Open **two terminal windows**:

**Terminal 1 — Backend** (port 3001)
```bash
cd backend
npm run dev
```

Expected output:
```
[INFO] ts-node-dev ver. 2.0.0
🦊 Git Fox backend running on http://localhost:3001
   GitHub token: ✅ set
```

**Terminal 2 — Frontend** (port 5173)
```bash
cd frontend
npm run dev
```

Expected output:
```
  VITE v8.x.x  ready in 151 ms
  ➜  Local:   http://localhost:5173/
```

Now open **http://localhost:5173** in your browser.

---

## 5. Optional: Run Both with One Command

From the repository root:

```bash
npm install          # installs `concurrently` at the root
npm run dev          # starts both backend and frontend concurrently
```

---

## 6. Verify It's Working

Test the backend directly:

```bash
curl http://localhost:3001/api/github/user/torvalds
# Should return JSON with Linus Torvalds' profile

curl http://localhost:3001/health
# {"status":"ok","timestamp":"..."}
```

Then search for `torvalds` in the browser UI — you should see the profile and 12 repositories appear.

---

## Available Scripts

### Backend (`/backend`)

| Script | Command | Description |
|---|---|---|
| `dev` | `npm run dev` | Start with ts-node-dev (hot reload) |
| `build` | `npm run build` | Compile TypeScript → `dist/` |
| `start` | `npm start` | Run compiled JS (production) |

### Frontend (`/frontend`)

| Script | Command | Description |
|---|---|---|
| `dev` | `npm run dev` | Vite dev server with HMR |
| `build` | `npm run build` | TypeScript check + Vite production bundle |
| `preview` | `npm run preview` | Preview the production build locally |

### Root

| Script | Command | Description |
|---|---|---|
| `dev` | `npm run dev` | Start both backend + frontend via `concurrently` |
| `build:backend` | `npm run build:backend` | Build backend only |
| `build:frontend` | `npm run build:frontend` | Build frontend only |
