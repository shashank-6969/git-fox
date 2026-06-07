import type { SortOption } from '../types/github';

const OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'stars', label: 'Stars (Most first)' },
  { value: 'name', label: 'Name (A → Z)' },
  { value: 'updated', label: 'Recently Updated' },
];

interface SortDropdownProps {
  value: SortOption;
  onChange: (v: SortOption) => void;
}

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  return (
    <div className="flex items-center gap-3 bg-[#161b22]/80 backdrop-blur-sm border border-[#30363d]/80 pl-4 pr-1 py-1 rounded-xl shadow-sm">
      <label htmlFor="sort-select" className="text-[#8b949e] text-sm font-medium whitespace-nowrap">
        Sort by:
      </label>
      <select
        id="sort-select"
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="bg-transparent border-none text-[#c9d1d9] text-sm font-medium py-1.5 focus:outline-none focus:ring-0 transition-all duration-200 cursor-pointer appearance-none"
        style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
      >
        {OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[#161b22] text-[#c9d1d9] py-2">
            {opt.label}
          </option>
        ))}
      </select>
      {/* Custom dropdown arrow */}
      <div className="pointer-events-none pr-3 flex items-center">
        <svg className="w-4 h-4 text-[#8b949e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}
