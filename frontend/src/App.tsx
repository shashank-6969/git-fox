import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { AmbientBackground } from './components/ui/AmbientBackground';
import { useRecentSearches } from './hooks/useRecentSearches';
import { useDebounce } from './hooks/useDebounce';
import { RecentSearches } from './components/RecentSearches';
import { AnimatePresence } from 'framer-motion';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  const [activeUsername, setActiveUsername] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showRecent, setShowRecent] = useState(false);

  const { recent, addSearch, removeSearch, clearAll } = useRecentSearches();

  // 300ms debounce — drives the actual search trigger
  const debouncedQuery = useDebounce(searchQuery, 300);

  const commitSearch = (username: string) => {
    const trimmed = username.trim();
    if (!trimmed) return;
    if (trimmed !== activeUsername) {
      queryClient.removeQueries({ queryKey: ['repos', activeUsername] });
    }
    setActiveUsername(trimmed);
    addSearch(trimmed);
    setShowRecent(false);
  };

  const handleSearch = (username: string) => {
    commitSearch(username);
  };

  const handleHome = () => {
    setActiveUsername(null);
    setSearchQuery('');
    setShowRecent(false);
  };

  const handleInputFocus = () => {
    if (recent.length > 0) setShowRecent(true);
  };

  const handleInputBlur = () => {
    // Delay so clicks on dropdown items fire first
    setTimeout(() => setShowRecent(false), 150);
  };

  const isLoading =
    !!activeUsername &&
    (queryClient.isFetching({ queryKey: ['user', activeUsername] }) > 0 ||
      queryClient.isFetching({ queryKey: ['repos', activeUsername] }) > 0);

  return (
    <QueryClientProvider client={queryClient}>
      <AmbientBackground />
      <div className="min-h-screen text-[#c9d1d9] relative z-0 flex flex-col items-center">
        <Header
          onSearch={handleSearch}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isLoading={isLoading}
          onHome={handleHome}
          onInputFocus={handleInputFocus}
          onInputBlur={handleInputBlur}
        />

        {/* Recent searches dropdown — floats over content, does not affect layout */}
        <div className="absolute top-16 left-0 right-0 z-40 flex justify-center px-6 pointer-events-none">
          <div className="w-full max-w-xl pointer-events-auto">
            <AnimatePresence>
              {showRecent && (
                <RecentSearches
                  searches={recent}
                  onSelect={(u) => {
                    setSearchQuery(u);
                    commitSearch(u);
                  }}
                  onRemove={removeSearch}
                  onClearAll={clearAll}
                />
              )}
            </AnimatePresence>
          </div>
        </div>

        <main className="w-full max-w-[1400px] px-6 py-12 flex flex-col">
          <HomePage username={activeUsername} debouncedQuery={debouncedQuery} />
        </main>
      </div>
    </QueryClientProvider>
  );
}
