import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

import {
  selectCartCount,
  selectCartTotal,
  useCartStore,
} from '@/features/cart/stores/cartStore';
import { CartItem } from '@/features/cart/components/CartItem';
import { formatCurrency } from '@/shared/lib/formatters';
import { Button } from '@/shared/ui/Button';
import { Drawer } from '@/shared/ui/Drawer';
import { EmptyState } from '@/shared/ui/EmptyState';

export function CartDrawer() {
  const { clearCart, closeCart, isOpen, items, removeItem, updateQuantity } = useCartStore();
  const total = selectCartTotal(items);
  const count = selectCartCount(items);

  return (
    <Drawer open={isOpen} onOpenChange={(open) => (open ? undefined : closeCart())}>
      <Drawer.Content aria-describedby="cart-description">
        <Drawer.Header>
          <Drawer.Title className="font-display text-2xl font-semibold">
            Seu carrinho ({count} {count === 1 ? 'item' : 'itens'})
          </Drawer.Title>
          <Drawer.Description id="cart-description" className="mt-1 text-sm text-fg-secondary">
            Confira as camisas escolhidas antes de finalizar.
          </Drawer.Description>
        </Drawer.Header>
        <Drawer.Body>
          {items.length ? (
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
          ) : (
            <EmptyState
              icon={<ShoppingBag className="size-10" />}
              title="Seu carrinho esta vazio"
              description="Adicione uma camisa pra ela aparecer aqui."
              action={{ label: 'Ver camisas', href: '/produtos' }}
            />
          )}
        </Drawer.Body>
        {items.length ? (
          <Drawer.Footer>
            <div className="mb-4 space-y-2 text-sm">
              <div className="flex justify-between text-fg-secondary">
                <span>Subtotal</span>
                <strong className="text-fg-primary">{formatCurrency(total)}</strong>
              </div>
              <div className="flex justify-between text-fg-secondary">
                <span>Frete</span>
                <span>Calculado no checkout</span>
              </div>
            </div>
            <Button asChild fullWidth onClick={closeCart}>
              <Link to="/checkout">Finalizar compra</Link>
            </Button>
            <Button className="mt-2" fullWidth variant="ghost" onClick={clearCart}>
              Limpar carrinho
            </Button>
          </Drawer.Footer>
        ) : null}
      </Drawer.Content>
    </Drawer>
  );
}
