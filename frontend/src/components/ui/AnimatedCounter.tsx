import { useEffect, useRef } from 'react';
import { useInView, useMotionValue, useSpring } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  formattingFn?: (value: number) => string;
  className?: string;
}

export function AnimatedCounter({ value, formattingFn, className }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  });
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [motionValue, isInView, value]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      if (ref.current) {
        const displayValue = formattingFn ? formattingFn(Math.round(latest)) : Math.round(latest).toLocaleString();
        ref.current.textContent = displayValue;
      }
    });
  }, [springValue, formattingFn]);

  return <span ref={ref} className={className} />;
}
