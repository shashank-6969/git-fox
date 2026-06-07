/**
 * GitHub Service — encapsulates all GitHub REST API communication.
 *
 * Routes should never call GitHub directly; they delegate here.
 * Responses are cached via cacheService to reduce API calls.
 */

import axios from 'axios';
import { GitHubUser, GitHubRepo } from '../types/github';
import { cacheService } from '../cache/cacheService';

const GITHUB_BASE = 'https://api.github.com';
const PER_PAGE = 30;

/** Build authenticated Axios headers if a token is provided */
function buildHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
}

/** Fetch a single user's public profile. Cached for TTL seconds. */
export async function getUser(username: string): Promise<GitHubUser> {
  const cacheKey = `user:${username}`;
  const cached = cacheService.get<GitHubUser>(cacheKey);
  if (cached) {
    console.log(`[Cache HIT] ${cacheKey}`);
    return cached;
  }

  console.log(`[Cache MISS] Fetching user: ${username}`);
  const { data } = await axios.get<GitHubUser>(`${GITHUB_BASE}/users/${username}`, {
    headers: buildHeaders(),
  });

  cacheService.set(cacheKey, data);
  return data;
}

/** Fetch a page of public repos for a user. Cached per page. */
export async function getRepos(username: string, page: number): Promise<GitHubRepo[]> {
  const cacheKey = `repos:${username}:page:${page}`;
  const cached = cacheService.get<GitHubRepo[]>(cacheKey);
  if (cached) {
    console.log(`[Cache HIT] ${cacheKey}`);
    return cached;
  }

  console.log(`[Cache MISS] Fetching repos: ${username} page ${page}`);
  const { data } = await axios.get<GitHubRepo[]>(`${GITHUB_BASE}/users/${username}/repos`, {
    headers: buildHeaders(),
    params: {
      per_page: PER_PAGE,
      page,
      sort: 'updated', // default server-side sort; client will re-sort
      type: 'public',
    },
  });

  cacheService.set(cacheKey, data);
  return data;
}
