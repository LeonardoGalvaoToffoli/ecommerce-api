import { Link } from 'react-router-dom';

import { Button } from '@/shared/ui/Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void } | { label: string; href: string };
}

export function EmptyState({ action, description, icon, title }: EmptyStateProps) {
  const actionNode = action ? (
    'href' in action ? (
      <Button asChild>
        <Link to={action.href}>{action.label}</Link>
      </Button>
    ) : (
      <Button onClick={action.onClick}>{action.label}</Button>
    )
  ) : null;

  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed border-border bg-bg-elevated/60 p-8 text-center">
      {icon ? <div className="mb-4 text-accent">{icon}</div> : null}
      <h2 className="font-display text-2xl font-semibold text-fg-primary">{title}</h2>
      {description ? <p className="mt-2 max-w-md text-sm text-fg-secondary">{description}</p> : null}
      {actionNode ? <div className="mt-6">{actionNode}</div> : null}
    </div>
  );
}
