import { forwardRef, useState } from 'react';
import type { InputHTMLAttributes } from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface GlassInputProps extends InputHTMLAttributes<HTMLInputElement> {
  isLoading?: boolean;
}

export const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  ({ className, isLoading, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <motion.div
        initial={false}
        animate={{
          boxShadow: isFocused
            ? '0 0 0 2px rgba(88, 166, 255, 0.4), 0 4px 12px rgba(0,0,0,0.2)'
            : '0 2px 8px rgba(0,0,0,0.1)',
        }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className={cn(
          "relative flex items-center w-full max-w-2xl rounded-xl",
          "bg-[#161b22]/80 backdrop-blur-md border border-[#30363d]",
          "transition-colors duration-200",
          isFocused ? "border-[#58a6ff]/50 bg-[#161b22]" : "hover:border-[#58a6ff]/30",
          className
        )}
      >
        <Search
          size={18}
          className={cn(
            "absolute left-4 shrink-0 transition-colors duration-200",
            isFocused ? "text-[#58a6ff]" : "text-[#8b949e]"
          )}
        />
        
        <input
          ref={ref}
          className={cn(
            "w-full bg-transparent text-[#c9d1d9] placeholder-[#6e7681]",
            "py-3 pl-11 pr-4 text-[15px]",
            "focus:outline-none focus:ring-0 rounded-xl"
          )}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          {...props}
        />
        
        {/* Loading Spinner inside input (optional, right aligned) */}
        {isLoading && (
          <div className="absolute right-4 w-4 h-4 border-2 border-[#58a6ff]/30 border-t-[#58a6ff] rounded-full animate-spin" />
        )}
      </motion.div>
    );
  }
);
GlassInput.displayName = 'GlassInput';
