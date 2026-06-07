import { MacWindowHeader } from './ui/MacWindowHeader';
import { GlassInput } from './ui/GlassInput';

interface HeaderProps {
  onSearch: (username: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isLoading: boolean;
  onHome?: () => void;
  onInputFocus?: () => void;
  onInputBlur?: () => void;
}

export function Header({
  onSearch,
  searchQuery,
  setSearchQuery,
  isLoading,
  onHome,
  onInputFocus,
  onInputBlur,
}: HeaderProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed) onSearch(trimmed);
  };

  return (
    <MacWindowHeader title="GitHub Repo Explorer" onHome={onHome}>
      <form onSubmit={handleSubmit} className="w-full max-w-xl">
        <GlassInput
          id="search-input"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search GitHub username…"
          autoComplete="off"
          spellCheck="false"
          isLoading={isLoading}
          onFocus={onInputFocus}
          onBlur={onInputBlur}
        />
        {/* Hidden submit button to allow Enter to submit form */}
        <button type="submit" className="hidden" disabled={isLoading || !searchQuery.trim()} />
      </form>
    </MacWindowHeader>
  );
}
