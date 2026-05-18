import { X } from 'lucide-react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/Button';
import { IconButton } from '@/shared/ui/IconButton';

type ToastKind = 'success' | 'error' | 'info';

type ToastPayload = {
  id: string;
  kind: ToastKind;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  duration: number;
};

type ToastOptions = {
  description?: string;
  action?: { label: string; onClick: () => void };
};

type ToastContextValue = {
  toast: {
    success: (title: string, options?: ToastOptions) => void;
    error: (title: string, options?: ToastOptions) => void;
    info: (title: string, options?: ToastOptions) => void;
  };
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastPayload[]>([]);
  const timeouts = useRef(new Map<string, number>());

  const remove = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
    const timeoutId = timeouts.current.get(id);
    if (timeoutId) window.clearTimeout(timeoutId);
    timeouts.current.delete(id);
  }, []);

  const push = useCallback(
    (kind: ToastKind, title: string, options?: ToastOptions) => {
      const id = crypto.randomUUID();
      const duration = kind === 'error' ? 6000 : 4000;
      const payload: ToastPayload = { id, kind, title, duration, ...options };

      setItems((current) => [payload, ...current].slice(0, 3));
      const timeoutId = window.setTimeout(() => remove(id), duration);
      timeouts.current.set(id, timeoutId);
    },
    [remove],
  );

  const value = useMemo<ToastContextValue>(
    () => ({
      toast: {
        success: (title, options) => push('success', title, options),
        error: (title, options) => push('error', title, options),
        info: (title, options) => push('info', title, options),
      },
    }),
    [push],
  );

  useEffect(
    () => () => {
      timeouts.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
      timeouts.current.clear();
    },
    [],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed inset-x-4 top-4 z-[70] flex flex-col gap-3 md:bottom-4 md:left-auto md:right-4 md:top-auto md:w-96">
        {items.map((item) => (
          <div
            key={item.id}
            role={item.kind === 'error' ? 'alert' : 'status'}
            className={cn(
              'rounded-lg border bg-bg-overlay p-4 text-fg-primary shadow-md',
              item.kind === 'success' && 'border-success/40',
              item.kind === 'error' && 'border-danger/50',
              item.kind === 'info' && 'border-accent/40',
            )}
          >
            <div className="flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{item.title}</p>
                {item.description ? <p className="mt-1 text-sm text-fg-secondary">{item.description}</p> : null}
                {item.action ? (
                  <Button
                    className="mt-3"
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      item.action?.onClick();
                      remove(item.id);
                    }}
                  >
                    {item.action.label}
                  </Button>
                ) : null}
              </div>
              <IconButton
                aria-label="Fechar notificacao"
                icon={<X className="size-4" />}
                size="sm"
                variant="ghost"
                onClick={() => remove(item.id)}
              />
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used inside ToastProvider');
  }

  return context;
}
