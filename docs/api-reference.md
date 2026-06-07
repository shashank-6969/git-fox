# API Reference

The GitFox backend exposes a thin proxy API. All routes are prefixed with `/api/github`.

> **Base URL (development):** `http://localhost:3001`  
> **Base URL (production):** Your Render deployment URL

---

## Authentication

The backend never requires client authentication. It optionally uses a server-side `GITHUB_TOKEN` environment variable to authenticate with GitHub and raise the rate limit.

Clients should **never** pass GitHub tokens — all authentication happens on the server.

---

## Endpoints

### `GET /api/github/user/:username`

Fetch a GitHub user's public profile.

#### Path Parameters

| Parameter | Type | Description |
|---|---|---|
| `username` | `string` | GitHub username (max 39 characters) |

#### Request Example

```http
GET /api/github/user/torvalds HTTP/1.1
Host: localhost:3001
```

```bash
curl http://localhost:3001/api/github/user/torvalds
```

#### Success Response — `200 OK`

```json
{
  "login": "torvalds",
  "id": 1024025,
  "avatar_url": "https://avatars.githubusercontent.com/u/1024025?v=4",
  "html_url": "https://github.com/torvalds",
  "name": "Linus Torvalds",
  "bio": null,
  "location": "Portland, OR",
  "public_repos": 12,
  "followers": 305900,
  "following": 0,
  "created_at": "2011-09-03T15:26:22Z",
  "updated_at": "2024-06-01T12:00:00Z"
}
```

#### Response Fields

| Field | Type | Description |
|---|---|---|
| `login` | `string` | GitHub username |
| `id` | `number` | Unique GitHub user ID |
| `avatar_url` | `string` | URL to profile avatar image |
| `html_url` | `string` | Link to GitHub profile page |
| `name` | `string \| null` | Display name |
| `bio` | `string \| null` | Profile bio |
| `location` | `string \| null` | Self-reported location |
| `public_repos` | `number` | Count of public repositories |
| `followers` | `number` | Follower count |
| `following` | `number` | Following count |
| `created_at` | `string` | ISO 8601 account creation date |
| `updated_at` | `string` | ISO 8601 last profile update |

---

### `GET /api/github/repos/:username`

Fetch a page of public repositories for a user.

#### Path Parameters

| Parameter | Type | Description |
|---|---|---|
| `username` | `string` | GitHub username |

#### Query Parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `page` | `number` | `1` | Page number (1-indexed). GitHub returns 30 repos per page. |

#### Request Example

```http
GET /api/github/repos/torvalds?page=1 HTTP/1.1
Host: localhost:3001
```

```bash
curl "http://localhost:3001/api/github/repos/gaearon?page=2"
```

#### Success Response — `200 OK`

Returns a JSON array of repository objects:

```json
[
  {
    "id": 2325298,
    "name": "linux",
    "full_name": "torvalds/linux",
    "html_url": "https://github.com/torvalds/linux",
    "description": "Linux kernel source tree",
    "fork": false,
    "language": "C",
    "stargazers_count": 235600,
    "forks_count": 62700,
    "open_issues_count": 3,
    "default_branch": "master",
    "visibility": "public",
    "size": 6300000,
    "created_at": "2011-09-04T22:48:12Z",
    "updated_at": "2026-06-05T12:00:00Z",
    "pushed_at": "2026-06-05T11:45:00Z",
    "topics": []
  }
]
```

#### Repository Object Fields

| Field | Type | Description |
|---|---|---|
| `id` | `number` | Unique repository ID |
| `name` | `string` | Repository short name |
| `full_name` | `string` | `owner/repo` format |
| `html_url` | `string` | Link to repository page |
| `description` | `string \| null` | Repository description |
| `fork` | `boolean` | Whether this is a fork |
| `language` | `string \| null` | Primary programming language |
| `stargazers_count` | `number` | Star count |
| `forks_count` | `number` | Fork count |
| `open_issues_count` | `number` | Open issue + PR count |
| `default_branch` | `string` | Default branch name (e.g. `main`, `master`) |
| `visibility` | `string` | `"public"` or `"private"` |
| `size` | `number` | Repository size in kilobytes |
| `created_at` | `string` | ISO 8601 creation date |
| `updated_at` | `string` | ISO 8601 last metadata update |
| `pushed_at` | `string` | ISO 8601 last push date |
| `topics` | `string[]` | Repository topic tags |

#### Pagination Notes

- GitHub returns **30 repositories per page**.
- If the response array length is exactly 30, there may be more pages.
- If the array length is less than 30, you have reached the last page.
- The frontend `useGithubRepos` hook implements this logic automatically.

---

### `GET /health`

Health check endpoint for uptime monitors and deployment platforms.

#### Request Example

```bash
curl http://localhost:3001/health
```

#### Success Response — `200 OK`

```json
{
  "status": "ok",
  "timestamp": "2026-06-05T20:00:00.000Z"
}
```

---

## Error Responses

All errors return a consistent JSON shape:

```json
{
  "error": "Human-readable message.",
  "status": 404
}
```

### Error Codes

| HTTP Status | When it occurs | `error` message |
|---|---|---|
| `400` | Username is empty or exceeds 39 characters | `"Invalid username."` |
| `404` | GitHub user does not exist | `"GitHub user or resource not found."` |
| `429` | GitHub API rate limit exceeded | `"GitHub API rate limit exceeded. Resets at HH:MM:SS AM."` |
| `500` | Unexpected server error | `"Internal server error."` |
| `502` | GitHub API returned an unexpected error | GitHub's original message |

### Error Handling Strategy

The global `errorHandler` middleware (in `src/middleware/errorHandler.ts`) intercepts all errors thrown in route handlers. It:

1. Checks if the error is an Axios error (`axios.isAxiosError(err)`)
2. Maps GitHub HTTP status codes to appropriate client-facing messages
3. For rate limits (403 from GitHub), extracts the `x-ratelimit-reset` header to show a reset time
4. Falls through to a generic 500 for unexpected errors

---

## Caching Behaviour

Responses are cached server-side for `CACHE_TTL` seconds (default: **60 seconds**).

| Request | Cache Key | TTL |
|---|---|---|
| `GET /user/alice` | `user:alice` | 60 s |
| `GET /repos/alice?page=1` | `repos:alice:page:1` | 60 s |
| `GET /repos/alice?page=2` | `repos:alice:page:2` | 60 s |

A cache hit is logged as `[Cache HIT] user:alice`. A cache miss triggers a GitHub API call and is logged as `[Cache MISS] Fetching user: alice`.

---

## Rate Limits

| Scenario | Limit |
|---|---|
| No token configured | 60 requests / hour / IP |
| `GITHUB_TOKEN` configured | 5,000 requests / hour |
| Cached responses | Do not count against rate limit |
