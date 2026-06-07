# Configuration

All configuration is managed via environment variables. No config files need to be edited.

---

## Backend — `backend/.env`

Create this file by copying the example:

```bash
cp backend/.env.example backend/.env
```

### Variables

---

#### `PORT`

| | |
|---|---|
| **Type** | `number` |
| **Default** | `3001` |
| **Required** | No |

The TCP port the Express server listens on.

```dotenv
PORT=3001
```

---

#### `GITHUB_TOKEN`

| | |
|---|---|
| **Type** | `string` |
| **Default** | _(empty)_ |
| **Required** | No (but strongly recommended) |

A GitHub Personal Access Token. Used to authenticate GitHub API requests on the server side, raising the rate limit from **60 to 5,000 requests/hour**.

**How to create one:**

1. Go to [github.com/settings/tokens](https://github.com/settings/tokens)
2. Click **Generate new token (classic)**
3. Give it a name like `git-fox-local`
4. Select **no scopes** (public data needs no permissions)
5. Copy the generated token

```dotenv
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

> ⚠️ **Never commit this value.** `backend/.env` is listed in `.gitignore`.

---

#### `CACHE_TTL`

| | |
|---|---|
| **Type** | `number` (seconds) |
| **Default** | `60` |
| **Required** | No |

How long (in seconds) user profiles and repository pages are cached before a fresh GitHub API call is made.

- Lower values = fresher data, more API calls
- Higher values = more API savings, slightly stale data

```dotenv
CACHE_TTL=60
```

---

#### `FRONTEND_URL`

| | |
|---|---|
| **Type** | `string` |
| **Default** | `*` (allow all origins) |
| **Required** | No (but set in production) |

The CORS `Access-Control-Allow-Origin` header value. In development `*` is safe. In production, set this to your Vercel frontend URL to restrict cross-origin access.

```dotenv
# Development
FRONTEND_URL=*

# Production
FRONTEND_URL=https://git-fox.vercel.app
```

---

## Frontend — `frontend/.env`

Create this file by copying the example:

```bash
cp frontend/.env.example frontend/.env
```

### Variables

---

#### `VITE_API_BASE_URL`

| | |
|---|---|
| **Type** | `string` (URL) |
| **Default** | `""` (empty string) |
| **Required** | **Only in production** |

The base URL of the deployed backend. When empty, the Vite dev server proxy forwards `/api/*` to `localhost:3001` — no config needed for local development.

```dotenv
# Development — leave empty
VITE_API_BASE_URL=

# Production — set to your Render URL
VITE_API_BASE_URL=https://git-fox-api.onrender.com
```

> **Note:** Vite requires all custom env vars to be prefixed with `VITE_` to be accessible in the browser bundle.

---

## Environment Reference Table

### Backend

| Variable | Default | Required | Description |
|---|---|---|---|
| `PORT` | `3001` | No | Server port |
| `GITHUB_TOKEN` | _(empty)_ | Recommended | GitHub PAT for 5k req/hr |
| `CACHE_TTL` | `60` | No | Cache duration in seconds |
| `FRONTEND_URL` | `*` | Production | CORS origin restriction |

### Frontend

| Variable | Default | Required | Description |
|---|---|---|---|
| `VITE_API_BASE_URL` | `""` | Production only | Deployed backend base URL |
