import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  GitFork,
  AlertCircle,
  GitBranch,
  Eye,
  ChevronDown,
  ExternalLink,
  Calendar,
  HardDrive,
} from 'lucide-react';
import type { GitHubRepo } from '../types/github';
import { formatNumber, timeAgo, formatDate, formatSize } from '../utils/formatters';
import { GlassCard } from './ui/GlassCard';

/** Map of common programming languages to their canonical colors */
const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Rust: '#dea584',
  Go: '#00ADD8',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  'C#': '#178600',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
  Dockerfile: '#384d54',
  Vue: '#41b883',
  Svelte: '#ff3e00',
  Dart: '#00B4AB',
};

function LanguageDot({ lang }: { lang: string }) {
  const color = LANG_COLORS[lang] ?? '#8b949e';
  return (
    <span className="flex items-center gap-1.5 text-xs font-medium text-[#8b949e]">
      <span
        className="inline-block w-2.5 h-2.5 rounded-full shrink-0 shadow-sm shadow-black/20"
        style={{ backgroundColor: color }}
      />
      {lang}
    </span>
  );
}

interface RepoCardProps {
  repo: GitHubRepo;
}

export function RepoCard({ repo }: RepoCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <GlassCard id={`repo-${repo.id}`} className="group p-5">
      {/* Top row: name + external link */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <a
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-[#58a6ff] font-semibold text-base hover:text-[#79b8ff] transition-colors min-w-0"
        >
          <span className="truncate">{repo.name}</span>
          <ExternalLink size={14} className="shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" />
        </a>

        {/* Visibility badge */}
        <span className="shrink-0 text-[10px] font-bold border border-[#30363d] bg-[#21262d]/40 text-[#8b949e] rounded-full px-2.5 py-0.5 uppercase tracking-wider">
          {repo.visibility}
        </span>
      </div>

      {/* Description */}
      {repo.description && (
        <p className="text-[#8b949e] text-sm leading-relaxed mb-3 line-clamp-2">
          {repo.description}
        </p>
      )}

      {/* Topics */}
      {repo.topics && repo.topics.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {repo.topics.slice(0, 5).map((topic) => (
            <span
              key={topic}
              className="text-[#58a6ff] bg-[#388bfd1a] text-[11px] font-medium px-2.5 py-0.5 rounded-full border border-[#388bfd40] hover:bg-[#388bfd30] transition-colors cursor-default"
            >
              {topic}
            </span>
          ))}
        </div>
      )}

      {/* Stats row */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 pt-4 border-t border-[#30363d]/30 text-xs text-[#8b949e]">
        {repo.language && <LanguageDot lang={repo.language} />}

        <StatChip icon={<Star size={14} />} value={formatNumber(repo.stargazers_count)} label="stars" />
        <StatChip icon={<GitFork size={14} />} value={formatNumber(repo.forks_count)} label="forks" />

        <span className="ml-auto text-[11px] text-[#6e7681] font-medium">
          Updated {timeAgo(repo.updated_at)}
        </span>
      </div>

      {/* Expand / collapse button */}
      <button
        id={`expand-repo-${repo.id}`}
        onClick={() => setExpanded((v) => !v)}
        className="mt-4 flex w-full items-center justify-between text-[11px] font-medium text-[#8b949e] hover:text-[#58a6ff] transition-colors duration-200 select-none bg-[#21262d]/30 hover:bg-[#21262d]/60 px-3 py-1.5 rounded-md border border-transparent hover:border-[#30363d]/50"
        aria-expanded={expanded}
      >
        <span>{expanded ? 'Hide details' : 'Show details'}</span>
        <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={14} />
        </motion.div>
      </button>

      {/* Expanded details with Framer Motion AnimatePresence */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="mt-3 pt-3 border-t border-[#30363d]/50 grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-3">
              <DetailItem icon={<AlertCircle size={14} />} label="Open Issues" value={String(repo.open_issues_count)} />
              <DetailItem icon={<GitBranch size={14} />} label="Default Branch" value={repo.default_branch} />
              <DetailItem icon={<Eye size={14} />} label="Visibility" value={repo.visibility} />
              <DetailItem icon={<HardDrive size={14} />} label="Size" value={formatSize(repo.size)} />
              <DetailItem icon={<Calendar size={14} />} label="Created" value={formatDate(repo.created_at)} />
              <DetailItem icon={<Calendar size={14} />} label="Last Push" value={formatDate(repo.pushed_at)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
}

function StatChip({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      {icon}
      <span className="font-semibold text-[#c9d1d9]">{value}</span>
      <span className="text-[#6e7681]">{label}</span>
    </span>
  );
}

function DetailItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 5 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.2, delay: 0.1 }}
      className="flex items-start gap-2"
    >
      <span className="text-[#8b949e] mt-0.5 shrink-0">{icon}</span>
      <div>
        <p className="text-[10px] text-[#6e7681] uppercase tracking-wider font-semibold">{label}</p>
        <p className="text-[#c9d1d9] text-[13px] font-medium mt-0.5 truncate max-w-[100px] sm:max-w-none" title={value}>{value}</p>
      </div>
    </motion.div>
  );
}
