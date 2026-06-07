import { SkeletonCard } from './ui/SkeletonCard';

export function ProfileCardSkeleton() {
  return (
    <SkeletonCard className="p-8">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Avatar skeleton */}
        <div className="shrink-0">
          <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-[#21262d]/60" />
        </div>
        {/* Text skeletons */}
        <div className="flex-1 space-y-4 w-full">
          <div className="flex gap-3">
            <div className="h-8 w-48 rounded-lg bg-[#21262d]/60" />
            <div className="h-8 w-32 rounded-lg bg-[#21262d]/60" />
          </div>
          <div className="space-y-2 mt-4">
            <div className="h-5 w-[90%] rounded-md bg-[#21262d]/60" />
            <div className="h-5 w-[70%] rounded-md bg-[#21262d]/60" />
          </div>
          <div className="h-8 w-32 rounded-full bg-[#21262d]/60 mt-4" />
          <div className="flex gap-4 mt-6 pt-4 border-t border-[#30363d]/40">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 w-32 rounded-lg bg-[#21262d]/60" />
            ))}
          </div>
        </div>
      </div>
    </SkeletonCard>
  );
}
