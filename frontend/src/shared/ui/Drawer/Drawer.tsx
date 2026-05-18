import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { type ComponentPropsWithoutRef } from 'react';

import { cn } from '@/shared/lib/cn';
import { IconButton } from '@/shared/ui/IconButton';

const drawerSizes = {
  sm: 'max-w-[400px]',
  md: 'max-w-[480px]',
  lg: 'max-w-[560px]',
};

type DrawerContentProps = ComponentPropsWithoutRef<typeof Dialog.Content> & {
  side?: 'left' | 'right';
  size?: keyof typeof drawerSizes;
};

function DrawerContent({
  children,
  className,
  side = 'right',
  size = 'md',
  ...props
}: DrawerContentProps) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />
      <Dialog.Content
        className={cn(
          'fixed top-0 z-50 flex h-dvh w-[calc(100vw-1rem)] flex-col border-border bg-bg-elevated text-fg-primary shadow-md transition duration-base ease-standard',
          side === 'right' ? 'right-0 border-l' : 'left-0 border-r',
          drawerSizes[size],
          className,
        )}
        {...props}
      >
        {children}
        <Dialog.Close asChild>
          <IconButton
            aria-label="Fechar painel"
            icon={<X className="size-4" />}
            variant="ghost"
            size="sm"
            className="absolute right-4 top-4"
          />
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  );
}

function DrawerHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('border-b border-border p-6 pr-14', className)} {...props} />;
}

function DrawerBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('min-h-0 flex-1 overflow-y-auto p-6', className)} {...props} />;
}

function DrawerFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('border-t border-border p-6', className)} {...props} />;
}

export const Drawer = Object.assign(Dialog.Root, {
  Trigger: Dialog.Trigger,
  Close: Dialog.Close,
  Content: DrawerContent,
  Header: DrawerHeader,
  Body: DrawerBody,
  Footer: DrawerFooter,
  Title: Dialog.Title,
  Description: Dialog.Description,
});
