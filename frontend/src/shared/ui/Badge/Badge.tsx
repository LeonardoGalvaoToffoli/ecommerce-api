import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type HTMLAttributes } from 'react';

import { cn } from '@/shared/lib/cn';

const badgeStyles = cva('inline-flex items-center gap-1.5 rounded-full border font-medium', {
  variants: {
    variant: {
      neutral: 'border-border bg-bg-elevated text-fg-secondary',
      success: 'border-success/30 bg-success/10 text-success',
      warning: 'border-warning/30 bg-warning/10 text-warning',
      danger: 'border-danger/30 bg-danger/10 text-danger',
      info: 'border-sky-400/30 bg-sky-400/10 text-sky-300',
      accent: 'border-accent/30 bg-accent/10 text-accent',
    },
    size: {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-3 py-1 text-sm',
    },
  },
  defaultVariants: {
    variant: 'neutral',
    size: 'sm',
  },
});

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeStyles> {
  dot?: boolean;
}

const dotStyles: Record<NonNullable<BadgeProps['variant']>, string> = {
  accent: 'bg-accent',
  danger: 'bg-danger',
  info: 'bg-sky-300',
  neutral: 'bg-fg-muted',
  success: 'bg-success',
  warning: 'bg-warning',
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ children, className, dot, size, variant = 'neutral', ...props }, ref) => {
    const resolvedVariant = variant ?? 'neutral';

    return (
      <span ref={ref} className={cn(badgeStyles({ variant: resolvedVariant, size }), className)} {...props}>
        {dot ? (
          <span className={cn('size-1.5 rounded-full', dotStyles[resolvedVariant])} aria-hidden="true" />
        ) : null}
      {children}
      </span>
    );
  },
);

Badge.displayName = 'Badge';
