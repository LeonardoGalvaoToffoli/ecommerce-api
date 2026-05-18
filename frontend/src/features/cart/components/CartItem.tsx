import { Minus, Plus, Trash2 } from 'lucide-react';

import type { CartItem as CartItemModel } from '@/features/cart/stores/cartStore';
import { formatCurrency } from '@/shared/lib/formatters';
import { IconButton } from '@/shared/ui/IconButton';

export interface CartItemProps {
  item: CartItemModel;
  onQuantidadeChange: (qtd: number) => void;
  onRemove: () => void;
}

export function CartItem({ item, onQuantidadeChange, onRemove }: CartItemProps) {
  return (
    <article className="grid grid-cols-[72px_1fr] gap-4 rounded-lg border border-border bg-bg-elevated p-3">
      {item.imagemUrl ? (
        <img
          src={item.imagemUrl}
          alt={item.nome}
          loading="lazy"
          className="aspect-square rounded-md border border-border object-cover"
        />
      ) : (
        <div className="surface-grid aspect-square rounded-md bg-bg-overlay" aria-hidden="true" />
      )}
      <div className="min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold text-fg-primary">{item.nome}</h3>
            {item.variacaoLabel ? <p className="text-sm text-fg-secondary">{item.variacaoLabel}</p> : null}
          </div>
          <IconButton
            aria-label={`Remover ${item.nome}`}
            icon={<Trash2 className="size-4" />}
            size="sm"
            variant="ghost"
            onClick={onRemove}
          />
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex items-center rounded-full border border-border">
            <IconButton
              aria-label={`Diminuir quantidade de ${item.nome}`}
              icon={<Minus className="size-4" />}
              size="sm"
              variant="ghost"
              onClick={() => onQuantidadeChange(item.quantidade - 1)}
            />
            <span className="w-8 text-center text-sm font-semibold" aria-label={`${item.quantidade} unidades`}>
              {item.quantidade}
            </span>
            <IconButton
              aria-label={`Aumentar quantidade de ${item.nome}`}
              icon={<Plus className="size-4" />}
              size="sm"
              variant="ghost"
              onClick={() => onQuantidadeChange(item.quantidade + 1)}
            />
          </div>
          <p className="font-semibold text-fg-primary">{formatCurrency(item.precoUnit * item.quantidade)}</p>
        </div>
      </div>
    </article>
  );
}
