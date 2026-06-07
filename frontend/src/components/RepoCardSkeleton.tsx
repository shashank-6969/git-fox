import { SkeletonCard } from './ui/SkeletonCard';

export function RepoCardSkeleton() {
  return (
    <SkeletonCard className="p-5 h-[180px]">
      <div className="flex items-start justify-between gap-4 mb-4">
        {/* Title skeleton */}
        <div className="h-6 w-1/2 rounded-md bg-[#21262d]/60" />
        {/* Badge skeleton */}
        <div className="h-5 w-16 rounded-full bg-[#21262d]/60 shrink-0" />
      </div>

      {/* Description lines */}
      <div className="space-y-2 mb-6">
        <div className="h-4 w-[90%] rounded bg-[#21262d]/60" />
        <div className="h-4 w-[60%] rounded bg-[#21262d]/60" />
      </div>

      {/* Stats row skeleton */}
      <div className="flex items-center gap-4 mt-auto">
        <div className="h-4 w-16 rounded bg-[#21262d]/60" />
        <div className="h-4 w-16 rounded bg-[#21262d]/60" />
        <div className="h-4 w-24 rounded bg-[#21262d]/60 ml-auto" />
      </div>
    </SkeletonCard>
  );
}
