import { cn } from '../../utils/cn';

interface SkeletonCardProps {
  className?: string;
  children: React.ReactNode;
}

export function SkeletonCard({ className, children }: SkeletonCardProps) {
  return (
    <div
      className={cn(
        "bg-[#161b22]/50 border border-[#30363d]/40 rounded-2xl relative overflow-hidden",
        className
      )}
    >
      {/* Shimmer effect overlay */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.04] to-transparent animate-[shimmer_2s_infinite]" />
      {children}
    </div>
  );
}

// Add this to index.css or a global styles file later:
// @keyframes shimmer {
//   100% {
//     transform: translateX(100%);
//   }
// }
