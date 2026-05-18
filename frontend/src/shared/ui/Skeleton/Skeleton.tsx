import { type HTMLAttributes } from 'react';

import { cn } from '@/shared/lib/cn';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'rect' | 'circle';
  width?: number | string;
  height?: number | string;
  lines?: number;
}

export function Skeleton({
  className,
  height,
  lines = 1,
  style,
  variant = 'rect',
  width,
  ...props
}: SkeletonProps) {
  if (variant === 'text' && lines > 1) {
    return (
      <div aria-busy="true" {...props} className={cn('space-y-2', className)}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            aria-hidden="true"
            className="h-3 rounded-full bg-[linear-gradient(90deg,var(--color-bg-elevated),var(--color-bg-overlay),var(--color-bg-elevated))] bg-[length:200%_100%] animate-shimmer"
            style={{ width: index === lines - 1 ? '70%' : width }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className={cn(
        'bg-[linear-gradient(90deg,var(--color-bg-elevated),var(--color-bg-overlay),var(--color-bg-elevated))] bg-[length:200%_100%] animate-shimmer',
        variant === 'text' && 'h-3 rounded-full',
        variant === 'rect' && 'rounded-md',
        variant === 'circle' && 'rounded-full',
        className,
      )}
      style={{ width, height, ...style }}
      {...props}
    />
  );
}
