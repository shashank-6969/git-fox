/**
 * useGithubUser — React Query hook for fetching a GitHub user profile.
 */

import { useQuery } from '@tanstack/react-query';
import { fetchUser } from '../services/api';
import type { GitHubUser } from '../types/github';

export function useGithubUser(username: string | null) {
  return useQuery<GitHubUser, Error>({
    queryKey: ['user', username],
    queryFn: () => fetchUser(username!),
    enabled: !!username,
    retry: false,
    staleTime: 60_000, // match backend cache TTL
  });
}
