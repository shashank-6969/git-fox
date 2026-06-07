/**
 * TypeScript types for GitHub API responses.
 * These mirror the GitHub REST API shapes but only include the fields we expose.
 */

export interface GitHubUser {
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

export interface GitHubRepo {
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

/** Standardised API error shape returned by our proxy */
export interface ApiError {
  error: string;
  status: number;
}
