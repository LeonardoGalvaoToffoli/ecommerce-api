import { cloneElement, type ReactElement } from 'react';

import { cn } from '@/shared/lib/cn';

type FieldControlProps = {
  id?: string;
  invalid?: boolean;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean | 'true' | 'false';
};

export interface FieldProps {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactElement<FieldControlProps>;
  className?: string;
}

export function Field({ children, className, error, hint, htmlFor, label, required }: FieldProps) {
  const messageId = error ? `${htmlFor}-error` : hint ? `${htmlFor}-hint` : undefined;
  const control = cloneElement(children, {
    id: children.props.id ?? htmlFor,
    invalid: Boolean(error) || children.props.invalid,
    'aria-invalid': Boolean(error) || children.props['aria-invalid'],
    'aria-describedby': [children.props['aria-describedby'], messageId].filter(Boolean).join(' ') || undefined,
  });

  return (
    <div className={cn('space-y-2', className)}>
      <label htmlFor={htmlFor} className="text-sm font-medium text-fg-primary">
        {label}
        {required ? <span className="ml-1 text-accent">*</span> : null}
      </label>
      {control}
      {error ? (
        <p id={`${htmlFor}-error`} className="text-sm text-danger" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p id={`${htmlFor}-hint`} className="text-sm text-fg-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
