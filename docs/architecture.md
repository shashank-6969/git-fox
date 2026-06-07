# Architecture

This document explains the system design, data flow, and folder structure of GitFox.

---

## High-Level Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        User's Browser                           │
│                                                                 │
│   React + TypeScript + Vite + Tailwind CSS + TanStack Query    │
│          http://localhost:5173  (dev)                           │
└───────────────────────────┬─────────────────────────────────────┘
                            │  HTTP  /api/*
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Express Proxy Backend                         │
│                                                                 │
│    Node.js · TypeScript · Express · Axios                      │
│          http://localhost:3001  (dev)                           │
│                                                                 │
│    ┌──────────────┐    ┌──────────────────┐                    │
│    │  Route Layer │───▶│  Service Layer   │                    │
│    │  github.ts   │    │  githubService.ts │                    │
│    └──────────────┘    └────────┬─────────┘                    │
│                                 │                               │
│                        ┌────────▼─────────┐                    │
│                        │   Cache Layer    │                    │
│                        │  cacheService.ts │                    │
│                        │  (node-cache)    │                    │
│                        └────────┬─────────┘                    │
└─────────────────────────────────┼───────────────────────────────┘
                                  │  HTTPS (cache miss only)
                                  ▼
                    ┌─────────────────────────┐
                    │     GitHub REST API     │
                    │   api.github.com/v3     │
                    └─────────────────────────┘
```

---

## Request Lifecycle

### 1. User submits a search

The user types a username and presses Enter or clicks **Search**. The `Header` component calls `onSearch(username)` in `App.tsx`.

### 2. React Query triggers fetches

`App.tsx` updates `activeUsername`, which enables both `useGithubUser` and `useGithubRepos` hooks. TanStack Query fires requests to `/api/github/user/:username` and `/api/github/repos/:username?page=1`.

### 3. Vite proxy forwards to backend (dev only)

In development, Vite's dev server proxies any `/api/*` request to `http://localhost:3001`. In production, `VITE_API_BASE_URL` points to the deployed backend.

### 4. Express routes thin delegation

The route handler (`routes/github.ts`) validates the username and delegates to `githubService`.

### 5. Cache check

`githubService` checks `cacheService.get(key)` before making any GitHub API call. Cache keys follow the pattern:

| Data | Cache Key |
|---|---|
| User profile | `user:<username>` |
| Repo page | `repos:<username>:page:<n>` |

### 6. GitHub API call (on cache miss)

Axios calls `api.github.com` with an `Authorization: Bearer <token>` header if configured, plus `Accept: application/vnd.github+json`.

### 7. Response cached + returned

The result is stored in node-cache for `CACHE_TTL` seconds (default 60), then returned as clean JSON to the frontend.

### 8. Frontend renders

React Query stores the data in its own cache. Components re-render with the data. Subsequent searches within 60 seconds hit the React Query cache before even reaching the backend.

---

## Why a Proxy Backend?

| Concern | Without Proxy | With Proxy |
|---|---|---|
| API token security | Token exposed in browser | Token stays on server |
| Rate limiting | 60 req/hr per browser IP | 5,000 req/hr per server IP |
| Caching | No server-side cache | 60 s cache reduces API calls |
| CORS | Subject to GitHub's CORS | Controlled by your server |
| Future features | Hard to add auth, logging | Middleware-friendly |

---

## Caching Design

The cache layer is designed for **easy replacement**:

```typescript
// cache/cacheService.ts
export interface ICacheService {
  get<T>(key: string): T | undefined;
  set<T>(key: string, value: T, ttlSeconds?: number): void;
  del(key: string): void;
  flush(): void;
}
```

**Current implementation**: `NodeCacheService` (in-memory, single process).  
**To switch to Redis**: Implement `ICacheService` with an `ioredis` client and replace the `cacheService` export. Zero changes needed in `githubService.ts` or routes.

---

## Folder Structure

```
git-fox/
├── README.md
├── package.json                    # Root monorepo — concurrently scripts
├── .gitignore
│
├── docs/                           # ← You are here
│   ├── index.md
│   ├── getting-started.md
│   ├── architecture.md
│   ├── api-reference.md
│   ├── frontend.md
│   ├── configuration.md
│   ├── deployment.md
│   └── contributing.md
│
├── backend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── src/
│       ├── index.ts                # Express bootstrap + middleware
│       ├── types/
│       │   └── github.ts           # GitHubUser, GitHubRepo, ApiError
│       ├── cache/
│       │   └── cacheService.ts     # ICacheService + NodeCacheService
│       ├── middleware/
│       │   └── errorHandler.ts     # Global Express error handler
│       ├── routes/
│       │   └── github.ts           # Route handlers (thin delegation)
│       └── services/
│           └── githubService.ts    # All GitHub API calls + cache logic
│
└── frontend/
    ├── package.json
    ├── vite.config.ts              # Vite + Tailwind v4 + /api proxy
    ├── index.html                  # SEO meta tags
    ├── .env.example
    └── src/
        ├── main.tsx                # React DOM entry point
        ├── App.tsx                 # QueryClientProvider + search state
        ├── index.css               # Design tokens + animations
        ├── types/
        │   └── github.ts           # Mirrors backend types
        ├── services/
        │   └── api.ts              # Axios instance → backend proxy
        ├── hooks/
        │   ├── useGithubUser.ts    # useQuery for user profile
        │   └── useGithubRepos.ts   # useInfiniteQuery for repos
        ├── pages/
        │   └── HomePage.tsx        # Main page orchestrator + landing hero
        ├── components/
        │   ├── Header.tsx
        │   ├── ProfileCard.tsx
        │   ├── ProfileCardSkeleton.tsx
        │   ├── RepoCard.tsx
        │   ├── RepoCardSkeleton.tsx
        │   ├── SortDropdown.tsx
        │   └── ErrorMessage.tsx
        └── utils/
            └── formatters.ts       # timeAgo, formatNumber, formatDate, formatSize
```

---

## Technology Choices

| Layer | Technology | Reason |
|---|---|---|
| Frontend framework | React 18 | Component model, ecosystem maturity |
| Language | TypeScript | End-to-end type safety |
| Build tool | Vite 8 | Sub-second HMR, native ESM, easy proxy |
| Styling | Tailwind CSS v4 | Utility-first, GitHub dark palette |
| Data fetching | TanStack Query v5 | Built-in caching, infinite scroll, devtools |
| HTTP client | Axios | Interceptors, consistent error handling |
| Backend runtime | Node.js 18 | Same language as frontend, large ecosystem |
| Web framework | Express | Minimal, well-understood, middleware-rich |
| Cache | node-cache | Zero dependencies, sufficient for single-instance |
| Icons | Lucide React | Consistent stroke-based icon set |
