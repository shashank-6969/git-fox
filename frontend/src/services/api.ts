/**
 * API service — Axios instance configured to talk to the backend proxy.
 * All GitHub data must flow through this, never calling github.com directly.
 */

import axios from 'axios';
import type { GitHubUser, GitHubRepo } from '../types/github';

const api = axios.create({
  // In dev, Vite proxies /api → backend. In prod, set VITE_API_BASE_URL.
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '',
  timeout: 15_000,
});

/** Fetch a user's public GitHub profile */
export async function fetchUser(username: string): Promise<GitHubUser> {
  const { data } = await api.get<GitHubUser>(`/api/github/user/${encodeURIComponent(username)}`);
  return data;
}

/** Fetch a page of public repositories for a user */
export async function fetchRepos(username: string, page: number): Promise<GitHubRepo[]> {
  const { data } = await api.get<GitHubRepo[]>(`/api/github/repos/${encodeURIComponent(username)}`, {
    params: { page },
  });
  return data;
}

export default api;
