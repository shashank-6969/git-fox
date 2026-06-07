import { motion, AnimatePresence } from 'framer-motion';
import { Clock, X, Trash2 } from 'lucide-react';

interface RecentSearchesProps {
  searches: string[];
  onSelect: (username: string) => void;
  onRemove: (username: string) => void;
  onClearAll: () => void;
}

const containerVariants = {
  hidden: {
    opacity: 0,
    y: -6,
    scaleY: 0.95,
    transformOrigin: 'top center',
  },
  visible: {
    opacity: 1,
    y: 0,
    scaleY: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 30,
      when: 'beforeChildren',
      staggerChildren: 0.04,
    },
  },
  exit: {
    opacity: 0,
    y: -4,
    scaleY: 0.97,
    transition: {
      duration: 0.15,
      ease: 'easeIn',
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -6 },
  visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 400, damping: 28 } },
  exit: { opacity: 0, height: 0, transition: { duration: 0.15 } },
};

export function RecentSearches({
  searches,
  onSelect,
  onRemove,
  onClearAll,
}: RecentSearchesProps) {
  if (searches.length === 0) return null;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      style={{ transformOrigin: 'top center' }}
      className="w-full max-w-xl mx-auto"
    >
      <div className="mt-2 bg-[#161b22]/95 backdrop-blur-xl border border-[#30363d]/70 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden ring-1 ring-white/5">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#30363d]/50">
          <span className="flex items-center gap-1.5 text-[#8b949e] text-xs font-medium uppercase tracking-wider">
            <Clock size={12} />
            Recent Searches
          </span>
          <button
            onClick={onClearAll}
            className="flex items-center gap-1 text-[#8b949e] hover:text-[#f78166] text-xs transition-colors duration-150"
          >
            <Trash2 size={12} />
            Clear all
          </button>
        </div>

        {/* Items */}
        <ul className="py-1">
          <AnimatePresence initial={false}>
            {searches.map((username) => (
              <motion.li
                key={username}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
                className="flex items-center gap-3 px-3 group"
              >
                {/* Clickable area */}
                <button
                  onClick={() => onSelect(username)}
                  className="flex-1 flex items-center gap-3 py-2.5 text-left hover:text-[#58a6ff] text-[#c9d1d9] text-sm transition-colors duration-150 rounded-lg"
                >
                  <Clock size={14} className="text-[#8b949e] shrink-0 group-hover:text-[#58a6ff] transition-colors duration-150" />
                  {username}
                </button>

                {/* Remove button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(username);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 text-[#8b949e] hover:text-[#f78166] transition-all duration-150 rounded"
                  title="Remove"
                >
                  <X size={13} />
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
    </motion.div>
  );
}

