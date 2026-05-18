import { Slot, Slottable } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';

const buttonStyles = cva(
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-md font-semibold transition duration-base ease-standard focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-accent text-accent-fg hover:brightness-95 active:scale-[0.99]',
        secondary:
          'border border-border bg-bg-elevated text-fg-primary hover:border-fg-muted hover:bg-bg-overlay active:scale-[0.99]',
        ghost: 'bg-transparent text-fg-primary hover:bg-bg-elevated active:scale-[0.99]',
        danger: 'bg-danger text-white hover:brightness-95 active:scale-[0.99]',
      },
      size: {
        sm: 'h-8 min-h-8 px-3 text-sm',
        md: 'h-10 px-4 text-base',
        lg: 'h-12 px-6 text-base',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonStyles> {
  asChild?: boolean;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      asChild,
      className,
      children,
      disabled,
      fullWidth,
      isLoading,
      leftIcon,
      rightIcon,
      size,
      variant,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        ref={ref}
        className={cn(buttonStyles({ variant, size, fullWidth }), className)}
        aria-busy={isLoading || undefined}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : leftIcon}
        {asChild ? (
          <Slottable>{children}</Slottable>
        ) : (
          <span className={cn(isLoading && 'opacity-80')}>{children}</span>
        )}
        {rightIcon}
      </Comp>
    );
  },
);

Button.displayName = 'Button';
