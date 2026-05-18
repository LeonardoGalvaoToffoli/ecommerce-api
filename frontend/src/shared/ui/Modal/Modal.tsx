import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { type ComponentPropsWithoutRef } from 'react';

import { cn } from '@/shared/lib/cn';
import { IconButton } from '@/shared/ui/IconButton';

const contentSizes = {
  sm: 'max-w-[400px]',
  md: 'max-w-[560px]',
  lg: 'max-w-[720px]',
  xl: 'max-w-[960px]',
};

type ModalContentProps = ComponentPropsWithoutRef<typeof Dialog.Content> & {
  size?: keyof typeof contentSizes;
};

function ModalContent({ children, className, size = 'md', ...props }: ModalContentProps) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm data-[state=open]:animate-in" />
      <Dialog.Content
        className={cn(
          'fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-bg-elevated p-6 text-fg-primary shadow-md',
          contentSizes[size],
          className,
        )}
        {...props}
      >
        {children}
        <Dialog.Close asChild>
          <IconButton
            aria-label="Fechar modal"
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

function ModalHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mb-6 space-y-2', className)} {...props} />;
}

function ModalBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('space-y-4', className)} {...props} />;
}

function ModalFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end', className)} {...props} />;
}

export const Modal = Object.assign(Dialog.Root, {
  Trigger: Dialog.Trigger,
  Close: Dialog.Close,
  Content: ModalContent,
  Header: ModalHeader,
  Body: ModalBody,
  Footer: ModalFooter,
  Title: Dialog.Title,
  Description: Dialog.Description,
});
