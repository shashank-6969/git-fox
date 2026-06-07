import { useState, useMemo } from 'react';
import { motion, type Variants } from 'framer-motion';
import { useGithubUser } from '../hooks/useGithubUser';
import { useGithubRepos } from '../hooks/useGithubRepos';
import { ProfileCard } from '../components/ProfileCard';
import { ProfileCardSkeleton } from '../components/ProfileCardSkeleton';
import { RepoCard } from '../components/RepoCard';
import { RepoCardSkeleton } from '../components/RepoCardSkeleton';
import { SortDropdown } from '../components/SortDropdown';
import { ErrorMessage } from '../components/ErrorMessage';
import { LanguageChart } from '../components/LanguageChart';
import type { GitHubRepo, SortOption } from '../types/github';
import { ChevronDown, Loader2 } from 'lucide-react';

/** Sort repos client-side based on selected option */
function sortRepos(repos: GitHubRepo[], sort: SortOption): GitHubRepo[] {
  const copy = [...repos];
  switch (sort) {
    case 'stars':
      return copy.sort((a, b) => b.stargazers_count - a.stargazers_count);
    case 'name':
      return copy.sort((a, b) => a.name.localeCompare(b.name));
    case 'updated':
      return copy.sort(
        (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
  }
}

/** Extract user-friendly error message from axios error */
function getErrorMessage(err: unknown): string {
  if (err instanceof Error) {
    const axiosErr = err as any;
    if (axiosErr.response?.data?.error) return axiosErr.response.data.error;
    if (axiosErr.message?.includes('Network') || axiosErr.code === 'ERR_NETWORK')
      return 'Cannot reach the backend server. Make sure it is running on port 3001.';
    return err.message;
  }
  return 'An unexpected error occurred.';
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
};

interface HomePageProps {
  username: string | null;
  /** Debounced search query — available for future use */
  debouncedQuery?: string;
}

export function HomePage({ username }: HomePageProps) {
  const [sort, setSort] = useState<SortOption>('stars');

  const userQuery = useGithubUser(username);
  const reposQuery = useGithubRepos(username);

  // Flatten pages into a single sorted array
  const allRepos = useMemo(() => {
    const flat = reposQuery.data?.pages.flat() ?? [];
    return sortRepos(flat, sort);
  }, [reposQuery.data, sort]);

  if (!username) {
    return <LandingHero />;
  }

  return (
    <div className="space-y-12">
      {/* ── Profile ─────────────────────────────────────────────────────── */}
      {userQuery.isLoading && <ProfileCardSkeleton />}
      {userQuery.isError && (
        <ErrorMessage
          message={getErrorMessage(userQuery.error)}
          onRetry={() => userQuery.refetch()}
        />
      )}
      {userQuery.data && <ProfileCard user={userQuery.data} />}

      {/* ── Repositories ─────────────────────────────────────────────────── */}
      {userQuery.data && (
        <section>
          {/* Section header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-[#c9d1d9] font-bold text-xl flex items-center gap-3 tracking-tight">
              Repositories
              {allRepos.length > 0 && (
                <span className="bg-[#58a6ff]/10 text-[#58a6ff] text-xs font-semibold px-2.5 py-0.5 rounded-full border border-[#58a6ff]/20 shadow-sm shadow-[#58a6ff]/10">
                  {allRepos.length}
                  {reposQuery.hasNextPage ? '+' : ''}
                </span>
              )}
            </h2>
            {allRepos.length > 1 && <SortDropdown value={sort} onChange={setSort} />}
          </div>

          {/* Skeleton loaders */}
          {reposQuery.isLoading && (
            <div className="grid gap-4 lg:grid-cols-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <RepoCardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Error */}
          {reposQuery.isError && (
            <ErrorMessage
              message={getErrorMessage(reposQuery.error)}
              onRetry={() => reposQuery.refetch()}
            />
          )}

          {/* Empty state */}
          {!reposQuery.isLoading && !reposQuery.isError && allRepos.length === 0 && (
            <ErrorMessage
              message={`${username} doesn't have any public repositories yet.`}
              type="empty"
            />
          )}

          {/* Repo grid */}
          {allRepos.length > 0 && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid gap-5 lg:grid-cols-2"
            >
              {allRepos.map((repo) => (
                <motion.div key={repo.id} variants={itemVariants}>
                  <RepoCard repo={repo} />
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Language Distribution Chart */}
          {!reposQuery.isLoading && allRepos.length > 0 && (
            <LanguageChart repos={allRepos} />
          )}

          {/* Load More button */}
          {reposQuery.hasNextPage && !reposQuery.isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-10 flex justify-center"
            >
              <button
                id="load-more-btn"
                onClick={() => reposQuery.fetchNextPage()}
                disabled={reposQuery.isFetchingNextPage}
                className="flex items-center gap-2 px-8 py-3 bg-[#21262d]/60 backdrop-blur-sm hover:bg-[#30363d] border border-[#30363d]/80 hover:border-[#58a6ff]/50 text-[#c9d1d9] text-sm font-medium rounded-xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-[#58a6ff]/10"
              >
                {reposQuery.isFetchingNextPage ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Loading…
                  </>
                ) : (
                  <>
                    <ChevronDown size={16} />
                    Load more repositories
                  </>
                )}
              </button>
            </motion.div>
          )}
        </section>
      )}
    </div>
  );
}

/** Hero displayed before any search */
function LandingHero() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="flex flex-col items-center justify-center py-32 text-center"
    >
      {/* Glowing icon */}
      <div className="relative mb-8 group">
        <div className="absolute inset-0 rounded-full blur-3xl bg-[#58a6ff]/30 scale-[2] group-hover:scale-[2.2] group-hover:bg-[#58a6ff]/40 transition-all duration-700 ease-out" />
        <svg
          viewBox="0 0 24 24"
          width="80"
          height="80"
          fill="currentColor"
          className="relative text-[#58a6ff] drop-shadow-2xl transition-transform duration-700 ease-out group-hover:scale-110"
        >
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
        </svg>
      </div>

      <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#c9d1d9] to-[#8b949e] mb-4 tracking-tight">
        Explore GitHub Profiles
      </h1>
      <p className="text-[#8b949e] text-xl max-w-2xl leading-relaxed mb-12 font-medium">
        Search for any GitHub username to view their profile, repositories,
        stats, and more in a premium interface.
      </p>


    </motion.div>
  );
}
