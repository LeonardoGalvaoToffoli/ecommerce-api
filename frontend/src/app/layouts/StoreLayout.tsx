import { Menu, ShoppingBag, UserRound } from 'lucide-react';
import { Link, NavLink, Outlet } from 'react-router-dom';

import { CartDrawer } from '@/features/cart/components/CartDrawer';
import { selectCartCount, useCartStore } from '@/features/cart/stores/cartStore';
import { isAdminUser, useAuthStore } from '@/features/auth/stores/authStore';
import { Button } from '@/shared/ui/Button';
import { IconButton } from '@/shared/ui/IconButton';

const baseNavItems = [
  { href: '/', label: 'Inicio' },
  { href: '/produtos', label: 'Camisas' },
];

export function StoreLayout() {
  const { items, openCart } = useCartStore();
  const { user } = useAuthStore();
  const count = selectCartCount(items);
  const isAdmin = isAdminUser(user);
  const navItems = user ? [...baseNavItems, { href: '/minha-conta', label: 'Minha conta' }] : baseNavItems;

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-40 border-b border-border bg-bg-base/85 backdrop-blur-xl">
        <div className="container-app flex h-20 items-center justify-between gap-4">
          <Link to="/" className="font-display text-xl font-bold tracking-tight">
            Cami<span className="text-accent">saria</span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex" aria-label="Navegacao principal">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  `text-sm font-medium transition hover:text-accent ${
                    isActive ? 'text-fg-primary' : 'text-fg-secondary'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            {isAdmin ? (
              <NavLink to="/admin" className="text-sm font-medium text-accent">
                Admin
              </NavLink>
            ) : null}
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" className="hidden md:inline-flex" leftIcon={<UserRound className="size-4" />}>
              <Link to={user ? '/minha-conta' : '/entrar'}>{user ? 'Conta' : 'Entrar'}</Link>
            </Button>
            <IconButton
              aria-label={`Abrir carrinho com ${count} itens`}
              icon={
                <span className="relative">
                  <ShoppingBag className="size-5" />
                  {count ? (
                    <span className="absolute -right-2 -top-2 grid size-4 place-items-center rounded-full bg-accent text-[10px] font-bold text-accent-fg">
                      {count}
                    </span>
                  ) : null}
                </span>
              }
              variant="secondary"
              onClick={openCart}
            />
            <IconButton aria-label="Abrir menu" icon={<Menu className="size-5" />} variant="ghost" className="md:hidden" />
          </div>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="border-t border-border py-10">
        <div className="container-app flex flex-col gap-3 text-sm text-fg-secondary md:flex-row md:items-center md:justify-between">
          <p>Camisaria, camisas com caimento, cor e estampa pra usar todo dia.</p>
          <p>Pagamento via PIX, carrinho que nao se perde e entrega pra todo Brasil.</p>
        </div>
      </footer>
      <CartDrawer />
    </div>
  );
}
