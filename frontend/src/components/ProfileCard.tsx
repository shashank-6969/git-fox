import { MapPin, Users, ExternalLink, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import type { GitHubUser } from '../types/github';
import { formatNumber } from '../utils/formatters';
import { GlassCard } from './ui/GlassCard';
import { AnimatedCounter } from './ui/AnimatedCounter';

interface ProfileCardProps {
  user: GitHubUser;
}

export function ProfileCard({ user }: ProfileCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <GlassCard className="p-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Avatar */}
          <div className="shrink-0">
            <a href={user.html_url} target="_blank" rel="noopener noreferrer" className="block relative group">
              <div className="absolute inset-0 bg-[#58a6ff]/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <img
                src={user.avatar_url}
                alt={`${user.login}'s avatar`}
                className="relative w-28 h-28 md:w-32 md:h-32 rounded-full border-2 border-[#30363d] shadow-lg object-cover transition-transform duration-300 group-hover:scale-105 group-hover:border-[#58a6ff]"
              />
            </a>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 w-full">
            <div className="flex flex-wrap items-start gap-3 mb-2">
              {user.name && (
                <h1 className="text-2xl font-bold text-[#c9d1d9] tracking-tight leading-tight">{user.name}</h1>
              )}
              <a
                href={user.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[#58a6ff] hover:text-[#79b8ff] transition-colors text-lg font-medium group"
              >
                @{user.login}
                <ExternalLink size={14} className="opacity-70 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>

            {user.bio && (
              <p className="text-[#8b949e] text-base mb-4 leading-relaxed line-clamp-3">
                {user.bio}
              </p>
            )}

            {/* Location */}
            {user.location && (
              <div className="flex items-center gap-2 text-[#8b949e] text-sm mb-5 bg-[#21262d]/40 w-fit px-3 py-1.5 rounded-full border border-[#30363d]/50">
                <MapPin size={14} className="text-[#8b949e] shrink-0" />
                <span className="font-medium">{user.location}</span>
              </div>
            )}

            {/* Stats row */}
            <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-[#30363d]/40">
              <Stat icon={<Users size={16} />} label="Followers" value={user.followers} />
              <Stat icon={<Users size={16} />} label="Following" value={user.following} />
              <Stat icon={<BookOpen size={16} />} label="Repositories" value={user.public_repos} />
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="flex items-center gap-2 bg-[#161b22]/50 px-4 py-2 rounded-lg border border-[#30363d]/50">
      <span className="text-[#58a6ff]">{icon}</span>
      <AnimatedCounter value={value} formattingFn={formatNumber} className="font-semibold text-[#c9d1d9] text-base" />
      <span className="text-[#8b949e] text-sm font-medium">{label}</span>
    </div>
  );
}
