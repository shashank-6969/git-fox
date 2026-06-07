/**
 * useGithubRepos — React Query infinite scroll hook for repository pages.
 */

import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchRepos } from '../services/api';
import type { GitHubRepo } from '../types/github';

const PAGE_SIZE = 30;

export function useGithubRepos(username: string | null) {
  return useInfiniteQuery<GitHubRepo[], Error>({
    queryKey: ['repos', username],
    queryFn: ({ pageParam }) => fetchRepos(username!, pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // If a full page was returned, there may be more
      if (lastPage.length === PAGE_SIZE) {
        return allPages.length + 1;
      }
      return undefined; // no more pages
    },
    enabled: !!username,
    retry: false,
    staleTime: 60_000,
  });
}
