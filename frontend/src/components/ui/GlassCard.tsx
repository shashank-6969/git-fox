import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

export function GlassCard({ children, className, id }: GlassCardProps) {
  return (
    <div
      id={id}
      className={cn(
        "bg-[#161b22]/70 backdrop-blur-md border border-[#30363d]/60",
        "shadow-lg shadow-black/20",
        "rounded-2xl transition-all duration-300",
        "hover:shadow-xl hover:shadow-black/30 hover:border-[#58a6ff]/30",
        className
      )}
    >
      {children}
    </div>
  );
}
