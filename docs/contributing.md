# Contributing

Thank you for your interest in contributing to GitFox! This guide covers code style, branch workflow, and common extension patterns.

---

## Development Setup

Follow the [Getting Started](./getting-started.md) guide to get the project running locally.

---

## Branch Naming

| Type | Pattern | Example |
|---|---|---|
| Feature | `feat/<description>` | `feat/add-gist-support` |
| Bug fix | `fix/<description>` | `fix/rate-limit-message` |
| Docs | `docs/<description>` | `docs/update-api-reference` |
| Refactor | `refactor/<description>` | `refactor/extract-pagination-hook` |

---

## Code Style

- **TypeScript everywhere** — no `any` types without a comment explaining why.
- **No logic in route handlers** — delegate to `githubService.ts`.
- **No GitHub API calls in the frontend** — always use the backend proxy.
- **Components should have a single responsibility** — split if a file exceeds ~200 lines.
- **Props interfaces** — always define a named interface for component props.
- **Pure utilities** — all functions in `utils/` should be pure (no side effects, no imports from React or Axios).

---

## Adding a New Backend Endpoint

1. **Add the service function** in `src/services/githubService.ts`:

```typescript
export async function getStarred(username: string, page: number): Promise<GitHubRepo[]> {
  const cacheKey = `starred:${username}:page:${page}`;
  const cached = cacheService.get<GitHubRepo[]>(cacheKey);
  if (cached) return cached;

  const { data } = await axios.get<GitHubRepo[]>(
    `${GITHUB_BASE}/users/${username}/starred`,
    { headers: buildHeaders(), params: { per_page: 30, page } }
  );

  cacheService.set(cacheKey, data);
  return data;
}
```

2. **Add the route** in `src/routes/github.ts`:

```typescript
router.get('/starred/:username', async (req, res, next) => {
  try {
    const { username } = req.params;
    const page = Math.max(1, Number(req.query.page) || 1);
    const starred = await githubService.getStarred(username, page);
    res.json(starred);
  } catch (err) {
    next(err);
  }
});
```

3. **Add the type** to `src/types/github.ts` if needed.

4. **Update the API reference** in `docs/api-reference.md`.

---

## Adding a New Frontend Hook

```typescript
// src/hooks/useGithubStarred.ts
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchStarred } from '../services/api';
import type { GitHubRepo } from '../types/github';

export function useGithubStarred(username: string | null) {
  return useInfiniteQuery<GitHubRepo[], Error>({
    queryKey: ['starred', username],
    queryFn: ({ pageParam }) => fetchStarred(username!, pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === 30 ? allPages.length + 1 : undefined,
    enabled: !!username,
    retry: false,
    staleTime: 60_000,
  });
}
```

---

## Replacing the Cache with Redis

The cache layer is designed for easy swapping. To replace node-cache with Redis:

1. Install `ioredis`:
   ```bash
   cd backend && npm install ioredis
   npm install -D @types/ioredis
   ```

2. Implement `ICacheService` using Redis:

```typescript
// src/cache/redisCacheService.ts
import Redis from 'ioredis';
import { ICacheService } from './cacheService';

class RedisCacheService implements ICacheService {
  private client: Redis;

  constructor() {
    this.client = new Redis(process.env.REDIS_URL!);
  }

  async get<T>(key: string): Promise<T | undefined> {
    const raw = await this.client.get(key);
    return raw ? JSON.parse(raw) : undefined;
  }

  async set<T>(key: string, value: T, ttlSeconds = 60): Promise<void> {
    await this.client.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async flush(): Promise<void> {
    await this.client.flushall();
  }
}

export const cacheService: ICacheService = new RedisCacheService();
```

3. In `src/cache/cacheService.ts`, change the export:

```typescript
// Replace:
export const cacheService: ICacheService = new NodeCacheService(TTL);

// With:
export { cacheService } from './redisCacheService';
```

4. Add `REDIS_URL` to `backend/.env`.

**No changes needed** in `githubService.ts` or the route handlers.

---

## Pull Request Checklist

- [ ] TypeScript compiles without errors (`npm run build` in both `backend/` and `frontend/`)
- [ ] No direct GitHub API calls in the frontend (`grep -r "api.github.com" frontend/src` returns nothing)
- [ ] New endpoints are documented in `docs/api-reference.md`
- [ ] New components have a props interface and are listed in `docs/frontend.md`
- [ ] Environment variables are documented in `docs/configuration.md`
- [ ] `README.md` is updated if the folder structure changes
