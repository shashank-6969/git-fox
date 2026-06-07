# Frontend Guide

This document covers the React frontend: components, hooks, services, utilities, and the design system.

---

## Design System

GitFox uses a **GitHub-inspired dark theme** defined via CSS custom properties in [`src/index.css`](../frontend/src/index.css).

### Color Tokens

| Token | Value | Usage |
|---|---|---|
| `--color-bg` | `#0d1117` | Page background |
| `--color-card` | `#161b22` | Cards, panels |
| `--color-border` | `#30363d` | Borders, dividers |
| `--color-text-primary` | `#c9d1d9` | Headings, labels |
| `--color-text-secondary` | `#8b949e` | Secondary text, icons |
| `--color-text-muted` | `#6e7681` | Metadata, timestamps |
| `--color-accent-blue` | `#58a6ff` | Links, focus rings, accents |
| `--color-accent-green` | `#238636` | Primary action buttons |
| `--color-accent-red` | `#f85149` | Error states |
| `--color-accent-yellow` | `#d29922` | Warning states |

### Animations

| Class | Keyframes | Usage |
|---|---|---|
| `.animate-fadeIn` | opacity 0→1 + translateY 6px→0 | New content appearing |
| `.animate-pulse` | opacity 1→0.5→1 | Skeleton loaders |
| `.animate-spin` | rotate 360° | Loading spinners |

---

## Project Structure

```
src/
├── App.tsx               # Root — QueryClientProvider + search state
├── main.tsx              # ReactDOM.createRoot entry point
├── index.css             # Design tokens, base reset, animations
│
├── pages/
│   └── HomePage.tsx      # Main page orchestrator
│
├── components/           # Reusable UI components
│   ├── Header.tsx
│   ├── ProfileCard.tsx
│   ├── ProfileCardSkeleton.tsx
│   ├── RepoCard.tsx
│   ├── RepoCardSkeleton.tsx
│   ├── SortDropdown.tsx
│   └── ErrorMessage.tsx
│
├── hooks/                # React Query data hooks
│   ├── useGithubUser.ts
│   └── useGithubRepos.ts
│
├── services/
│   └── api.ts            # Axios instance
│
├── types/
│   └── github.ts         # TypeScript interfaces
│
└── utils/
    └── formatters.ts     # Pure formatting functions
```

---

## Components

### `<Header />`

**File:** [`src/components/Header.tsx`](../frontend/src/components/Header.tsx)

The sticky top navigation bar containing the GitFox logo and the search input.

#### Props

| Prop | Type | Description |
|---|---|---|
| `onSearch` | `(username: string) => void` | Called when the user submits a search |
| `searchQuery` | `string` | Controlled input value |
| `setSearchQuery` | `(q: string) => void` | Input change handler |
| `isLoading` | `boolean` | Disables the Search button while fetching |

#### Behaviour

- Submits on **Enter** key (form `onSubmit`) or button click.
- Trims whitespace before calling `onSearch`.
- Disables the button if the input is empty or `isLoading` is `true`.

---

### `<ProfileCard />`

**File:** [`src/components/ProfileCard.tsx`](../frontend/src/components/ProfileCard.tsx)

Displays a user's public GitHub profile information.

#### Props

| Prop | Type | Description |
|---|---|---|
| `user` | `GitHubUser` | Full user object from the API |

#### Displayed Fields

- Avatar (links to GitHub profile)
- Name + `@username` (links to GitHub profile)
- Bio
- Location (with map pin icon)
- Followers / Following / Public Repos stats

---

### `<ProfileCardSkeleton />`

**File:** [`src/components/ProfileCardSkeleton.tsx`](../frontend/src/components/ProfileCardSkeleton.tsx)

An animated skeleton placeholder rendered while the user profile is loading. No props.

---

### `<RepoCard />`

**File:** [`src/components/RepoCard.tsx`](../frontend/src/components/RepoCard.tsx)

An expandable card for a single repository.

#### Props

| Prop | Type | Description |
|---|---|---|
| `repo` | `GitHubRepo` | Full repository object from the API |

#### Default (collapsed) view

- Repository name (link to GitHub)
- Visibility badge (`PUBLIC` / `PRIVATE`)
- Description (2-line clamp)
- Topics (up to 5 badges)
- Language dot + colour + name
- Star count + fork count
- "Updated X ago" timestamp

#### Expanded view (click "Show details")

| Field | Source |
|---|---|
| Open Issues | `repo.open_issues_count` |
| Default Branch | `repo.default_branch` |
| Visibility | `repo.visibility` |
| Size | `formatSize(repo.size)` |
| Created | `formatDate(repo.created_at)` |
| Last Push | `formatDate(repo.pushed_at)` |

#### Language Colours

`RepoCard` includes a built-in map of language names → hex colours matching GitHub's language colour palette. Unmapped languages fall back to `#8b949e`.

---

### `<RepoCardSkeleton />`

**File:** [`src/components/RepoCardSkeleton.tsx`](../frontend/src/components/RepoCardSkeleton.tsx)

Animated skeleton for a repository card. No props. Rendered 6 at a time during the initial repos fetch.

---

### `<SortDropdown />`

**File:** [`src/components/SortDropdown.tsx`](../frontend/src/components/SortDropdown.tsx)

A `<select>` element for choosing the client-side sort order.

#### Props

| Prop | Type | Description |
|---|---|---|
| `value` | `SortOption` | Current sort selection |
| `onChange` | `(v: SortOption) => void` | Called when the user changes the sort |

#### Sort Options

| Value | Label | Sort logic |
|---|---|---|
| `stars` | ⭐ Stars (Most first) | `b.stargazers_count - a.stargazers_count` |
| `name` | 🔤 Name (A → Z) | `a.name.localeCompare(b.name)` |
| `updated` | 🕒 Recently Updated | `new Date(b.updated_at) - new Date(a.updated_at)` |

---

### `<ErrorMessage />`

**File:** [`src/components/ErrorMessage.tsx`](../frontend/src/components/ErrorMessage.tsx)

Context-aware error display with automatic type detection.

#### Props

| Prop | Type | Description |
|---|---|---|
| `message` | `string` | Error message to display |
| `type` | `ErrorType` (optional) | Override auto-detection |
| `onRetry` | `() => void` (optional) | If provided, shows a "Try again" button |

#### Auto-detected Error Types

| Type | Detection Heuristic | Icon | Title |
|---|---|---|---|
| `not-found` | message contains `"not found"` | `UserX` | User Not Found |
| `rate-limit` | message contains `"rate limit"` | `AlertTriangle` | Rate Limit Exceeded |
| `network` | message contains `"network"`, `"econnrefused"`, or `"timeout"` | `WifiOff` | Connection Error |
| `empty` | explicitly passed | `Inbox` | No Repositories |
| `generic` | fallback | `AlertTriangle` | Something Went Wrong |

---

## Pages

### `<HomePage />`

**File:** [`src/pages/HomePage.tsx`](../frontend/src/pages/HomePage.tsx)

The primary page component. Orchestrates all data display.

#### Props

| Prop | Type | Description |
|---|---|---|
| `username` | `string \| null` | Active search username; `null` shows the landing hero |

#### Behaviour

- When `username` is `null`: renders `<LandingHero />`.
- While loading: renders `<ProfileCardSkeleton />` + 6× `<RepoCardSkeleton />`.
- On error: renders `<ErrorMessage />` with a retry button.
- On success: renders `<ProfileCard />` + repo grid + `<SortDropdown />` + **Load More** button.

#### Client-side Sorting

All repo pages are flattened and sorted via `sortRepos(flat, sort)` using `useMemo`, so sorting is instantaneous even across multiple loaded pages.

---

## Hooks

### `useGithubUser(username)`

**File:** [`src/hooks/useGithubUser.ts`](../frontend/src/hooks/useGithubUser.ts)

Fetches and caches a user profile using TanStack Query.

```typescript
const { data, isLoading, isError, error, refetch } = useGithubUser('torvalds');
```

| Parameter | Type | Description |
|---|---|---|
| `username` | `string \| null` | Pass `null` to disable the query |

| Return | Type | Description |
|---|---|---|
| `data` | `GitHubUser \| undefined` | User profile when loaded |
| `isLoading` | `boolean` | True during initial fetch |
| `isError` | `boolean` | True if the request failed |
| `error` | `Error \| null` | The error object |
| `refetch` | `function` | Manually re-trigger the fetch |

**Configuration:**
- `enabled`: only fires when `username` is non-null
- `retry: false`: does not retry on 404s
- `staleTime: 60_000`: matches backend cache TTL

---

### `useGithubRepos(username)`

**File:** [`src/hooks/useGithubRepos.ts`](../frontend/src/hooks/useGithubRepos.ts)

Fetches paginated repositories using TanStack Query's infinite query.

```typescript
const {
  data,
  isLoading,
  isError,
  error,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  refetch,
} = useGithubRepos('torvalds');
```

| Parameter | Type | Description |
|---|---|---|
| `username` | `string \| null` | Pass `null` to disable the query |

| Return | Type | Description |
|---|---|---|
| `data.pages` | `GitHubRepo[][]` | Array of pages, each containing up to 30 repos |
| `hasNextPage` | `boolean` | True when the last page had exactly 30 items |
| `isFetchingNextPage` | `boolean` | True while loading an additional page |
| `fetchNextPage` | `function` | Load the next page |

**Pagination logic (`getNextPageParam`):**
- If `lastPage.length === 30` → returns `allPages.length + 1` (fetch page N+1)
- Otherwise → returns `undefined` (stop)

---

## Services

### `api.ts`

**File:** [`src/services/api.ts`](../frontend/src/services/api.ts)

A configured Axios instance that routes requests to the backend proxy.

```typescript
import { fetchUser, fetchRepos } from './services/api';

const user = await fetchUser('gaearon');
const repos = await fetchRepos('gaearon', 1);
```

#### `fetchUser(username: string): Promise<GitHubUser>`

Calls `GET /api/github/user/:username`.

#### `fetchRepos(username: string, page: number): Promise<GitHubRepo[]>`

Calls `GET /api/github/repos/:username?page=<page>`.

#### Base URL Resolution

| Environment | `baseURL` |
|---|---|
| Development | `""` (Vite proxy handles `/api/*` → `localhost:3001`) |
| Production | `VITE_API_BASE_URL` env var (e.g. `https://git-fox-api.onrender.com`) |

---

## Types

**File:** [`src/types/github.ts`](../frontend/src/types/github.ts)

```typescript
interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  bio: string | null;
  location: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  fork: boolean;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  default_branch: string;
  visibility: string;
  size: number;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  topics: string[];
}

type SortOption = 'stars' | 'name' | 'updated';
```

---

## Utilities

**File:** [`src/utils/formatters.ts`](../frontend/src/utils/formatters.ts)

Pure functions for formatting display values.

### `formatNumber(n: number): string`

Formats large numbers with K/M suffixes.

```typescript
formatNumber(1500)       // "1.5k"
formatNumber(2000000)    // "2.0m"
formatNumber(42)         // "42"
```

### `timeAgo(dateStr: string): string`

Returns a relative time string.

```typescript
timeAgo('2026-06-04T12:00:00Z')  // "1 day ago"
timeAgo('2026-01-01T00:00:00Z')  // "5 months ago"
```

### `formatDate(dateStr: string): string`

Returns a human-readable date.

```typescript
formatDate('2011-09-04T22:48:12Z')  // "Sep 4, 2011"
```

### `formatSize(kb: number): string`

Converts repo size (in KB) to a readable string.

```typescript
formatSize(0)       // "< 1 KB"
formatSize(512)     // "512 KB"
formatSize(6300000) // "6152.3 MB"
```
