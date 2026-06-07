import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface MacWindowHeaderProps {
  children?: ReactNode;
  className?: string;
  title?: string;
  onHome?: () => void;
}

export function MacWindowHeader({ children, className, title, onHome }: MacWindowHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full",
        "bg-[#0d1117]/60 backdrop-blur-xl border-b border-[#30363d]/50",
        "shadow-sm",
        className
      )}
    >
      <div className="mx-auto max-w-[1400px] px-6 h-16 flex items-center gap-4 relative">
        
        {/* Animated GitHub Logo / Home Button */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center z-20">
          <button 
            onClick={onHome}
            className="group flex items-center justify-center p-1.5 rounded-full hover:bg-[#21262d] transition-colors focus:outline-none focus:ring-2 focus:ring-[#58a6ff]/50"
            title="Return to Home"
          >
            <svg 
              viewBox="0 0 24 24" 
              width="24" 
              height="24" 
              fill="currentColor" 
              className="text-[#c9d1d9] transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110 group-hover:text-[#58a6ff] group-active:scale-95"
            >
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </button>
        </div>

        {/* Optional Title (Center) */}
        {title && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
             <span className="text-sm font-medium text-[#8b949e]">{title}</span>
          </div>
        )}

        {/* Content area (Search, etc.) */}
        <div className="flex-1 flex justify-center w-full relative z-10">
          {children}
        </div>
      </div>
    </header>
  );
}
