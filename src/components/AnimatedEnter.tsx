import type { ReactNode } from 'react';

type AnimationName = 'slide-in' | 'slide-in-down';

interface AnimatedEnterProps {
  children: ReactNode;
  className?: string;
  animation?: AnimationName;
}

export function AnimatedEnter({
  children,
  className = '',
  animation = 'slide-in',
}: AnimatedEnterProps) {
  return (
    <div
      className={`diggel-animate diggel-animate--${animation} ${className}`.trim()}
    >
      {children}
    </div>
  );
}
