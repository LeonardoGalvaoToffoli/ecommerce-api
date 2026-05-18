import * as RadixSelect from '@radix-ui/react-select';
import { Check, ChevronDown } from 'lucide-react';

import { cn } from '@/shared/lib/cn';

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
  disabled?: boolean;
}

export interface SelectProps<T extends string = string> {
  options: SelectOption<T>[];
  value?: T;
  defaultValue?: T;
  onValueChange?: (value: T) => void;
  placeholder?: string;
  invalid?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  id?: string;
}

const sizeStyles = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-11 px-4 text-base',
  lg: 'h-12 px-4 text-base',
};

export function Select<T extends string = string>({
  defaultValue,
  disabled,
  id,
  invalid,
  onValueChange,
  options,
  placeholder = 'Selecione',
  size = 'md',
  value,
}: SelectProps<T>) {
  return (
    <RadixSelect.Root
      defaultValue={defaultValue}
      disabled={disabled}
      value={value}
      onValueChange={(nextValue) => onValueChange?.(nextValue as T)}
    >
      <RadixSelect.Trigger
        id={id}
        aria-invalid={invalid || undefined}
        className={cn(
          'flex w-full items-center justify-between rounded-md border border-border bg-bg-elevated text-left text-fg-primary shadow-sm transition duration-base ease-standard data-[placeholder]:text-fg-muted hover:border-fg-muted focus:border-accent focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
          invalid && 'border-danger focus:border-danger',
          sizeStyles[size],
        )}
      >
        <RadixSelect.Value placeholder={placeholder} />
        <RadixSelect.Icon asChild>
          <ChevronDown className="size-4 text-fg-muted" aria-hidden="true" />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>
      <RadixSelect.Portal>
        <RadixSelect.Content
          position="popper"
          sideOffset={8}
          className="z-50 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-md border border-border bg-bg-overlay p-1 text-fg-primary shadow-md"
        >
          <RadixSelect.Viewport>
            {options.map((option) => (
              <RadixSelect.Item
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                className="relative flex cursor-pointer select-none items-center rounded-sm py-2 pl-8 pr-3 text-sm outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-bg-elevated data-[disabled]:opacity-50"
              >
                <RadixSelect.ItemIndicator className="absolute left-2 inline-flex items-center">
                  <Check className="size-4 text-accent" aria-hidden="true" />
                </RadixSelect.ItemIndicator>
                <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
              </RadixSelect.Item>
            ))}
          </RadixSelect.Viewport>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
}
