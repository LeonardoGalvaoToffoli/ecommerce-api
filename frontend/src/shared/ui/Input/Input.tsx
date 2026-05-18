import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';

const inputStyles = cva(
  'w-full rounded-md border border-border bg-bg-elevated text-fg-primary shadow-sm transition duration-base ease-standard placeholder:text-fg-muted hover:border-fg-muted focus:border-accent focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 read-only:bg-bg-overlay',
  {
    variants: {
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-11 px-4 text-base',
        lg: 'h-12 px-4 text-base',
      },
      invalid: {
        true: 'border-danger focus:border-danger focus-visible:outline-danger',
      },
      withLeftAdornment: {
        true: 'pl-10',
      },
      withRightAdornment: {
        true: 'pr-10',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputStyles> {
  invalid?: boolean;
  leftAdornment?: ReactNode;
  rightAdornment?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, leftAdornment, rightAdornment, size, ...props }, ref) => (
    <span className="relative block">
      {leftAdornment ? (
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-fg-muted">
          {leftAdornment}
        </span>
      ) : null}
      <input
        ref={ref}
        className={cn(
          inputStyles({
            size,
            invalid,
            withLeftAdornment: Boolean(leftAdornment),
            withRightAdornment: Boolean(rightAdornment),
          }),
          className,
        )}
        aria-invalid={invalid || props['aria-invalid']}
        {...props}
      />
      {rightAdornment ? (
        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-fg-muted">
          {rightAdornment}
        </span>
      ) : null}
    </span>
  ),
);

Input.displayName = 'Input';
