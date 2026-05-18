import { forwardRef } from 'react';

import { Button, type ButtonProps } from '@/shared/ui/Button';

export interface IconButtonProps
  extends Omit<ButtonProps, 'children' | 'leftIcon' | 'rightIcon'> {
  icon: React.ReactNode;
  'aria-label': string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, size = 'md', ...props }, ref) => (
    <Button
      ref={ref}
      size={size}
      className={size === 'sm' ? 'size-8 px-0' : size === 'lg' ? 'size-12 px-0' : 'size-10 px-0'}
      {...props}
    >
      <span aria-hidden="true">{icon}</span>
    </Button>
  ),
);

IconButton.displayName = 'IconButton';
