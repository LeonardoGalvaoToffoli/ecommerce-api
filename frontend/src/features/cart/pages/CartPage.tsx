import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

import { CartItem } from '@/features/cart/components/CartItem';
import {
  selectCartTotal,
  useCartStore,
} from '@/features/cart/stores/cartStore';
import { formatCurrency } from '@/shared/lib/formatters';
import { Button } from '@/shared/ui/Button';
import { EmptyState } from '@/shared/ui/EmptyState';

export function CartPage() {
  const { items, removeItem, updateQuantity } = useCartStore();
  const total = selectCartTotal(items);

  return (
    <section className="container-app py-12">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">Carrinho</p>
        <h1 className="mt-2 font-display text-5xl font-bold tracking-tight">Revise sua compra</h1>
      </div>
      {items.length ? (
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-3">
            {items.map((item) => (
              <CartItem
                key={`${item.produtoId}-${item.variacaoId ?? 'base'}`}
                item={item}
                onQuantidadeChange={(qtd) => updateQuantity(item.produtoId, item.variacaoId, qtd)}
                onRemove={() => removeItem(item.produtoId, item.variacaoId)}
              />
            ))}
          </div>
          <aside className="h-fit rounded-lg border border-border bg-bg-elevated p-6">
            <h2 className="font-display text-2xl font-semibold">Resumo</h2>
            <div className="mt-5 space-y-3 text-sm text-fg-secondary">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <strong className="text-fg-primary">{formatCurrency(total)}</strong>
              </div>
              <div className="flex justify-between">
                <span>Frete</span>
                <span>No checkout</span>
              </div>
            </div>
            <Button asChild className="mt-6" fullWidth>
              <Link to="/checkout">Finalizar compra</Link>
            </Button>
          </aside>
        </div>
      ) : (
        <EmptyState
          icon={<ShoppingBag className="size-10" />}
          title="Seu carrinho esta vazio"
          description="Da uma olhada nas camisas e adicione as suas favoritas. A gente segura aqui ate voce voltar."
          action={{ label: 'Ver camisas', href: '/produtos' }}
        />
      )}
    </section>
  );
}
