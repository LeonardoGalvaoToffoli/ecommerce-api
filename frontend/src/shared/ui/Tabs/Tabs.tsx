import * as RadixTabs from '@radix-ui/react-tabs';

import { cn } from '@/shared/lib/cn';

function TabsList({ className, ...props }: React.ComponentPropsWithoutRef<typeof RadixTabs.List>) {
  return <RadixTabs.List className={cn('flex gap-2 border-b border-border', className)} {...props} />;
}

function TabsTrigger({ className, ...props }: React.ComponentPropsWithoutRef<typeof RadixTabs.Trigger>) {
  return (
    <RadixTabs.Trigger
      className={cn(
        'border-b-2 border-transparent px-4 py-3 text-sm font-semibold text-fg-secondary transition hover:text-fg-primary data-[state=active]:border-accent data-[state=active]:text-fg-primary',
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({ className, ...props }: React.ComponentPropsWithoutRef<typeof RadixTabs.Content>) {
  return <RadixTabs.Content className={cn('pt-6', className)} {...props} />;
}

export const Tabs = Object.assign(RadixTabs.Root, {
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
});
