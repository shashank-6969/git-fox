# GitFox Documentation

Welcome to the **GitFox** developer documentation. Use the links below to navigate.

---

## Contents

| Document | Description |
|---|---|
| [Getting Started](./getting-started.md) | Installation, environment setup, and running locally |
| [Architecture](./architecture.md) | System design, data flow, and folder structure |
| [API Reference](./api-reference.md) | Backend endpoint specs, request/response shapes, error codes |
| [Frontend Guide](./frontend.md) | Components, hooks, services, utilities, and design system |
| [Configuration](./configuration.md) | All environment variables explained |
| [Deployment](./deployment.md) | Vercel (frontend) + Render (backend) deployment walkthrough |
| [Contributing](./contributing.md) | Code style, PR workflow, extending the codebase |

---

## Quick Start

```bash
# 1. Install dependencies
cd backend && npm install
cd ../frontend && npm install

# 2. Configure environment
cp backend/.env.example backend/.env    # add GITHUB_TOKEN for higher rate limits

# 3. Start both servers
# Terminal A
cd backend && npm run dev     # → http://localhost:3001

# Terminal B
cd frontend && npm run dev    # → http://localhost:5173
```

---

## Key Design Decisions

- **Frontend never calls GitHub directly** — all requests proxy through the Express backend.
- **Caching is abstracted** behind `ICacheService` — swap node-cache for Redis with zero call-site changes.
- **Service layer** (`githubService.ts`) keeps route handlers thin.
- **Infinite query** (TanStack Query) powers the Load More pagination — automatically tracks pages.
- **Client-side sorting** keeps sort feel instantaneous without extra network requests.
