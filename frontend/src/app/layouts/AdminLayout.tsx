import { LayoutDashboard, Package, ReceiptText, UsersRound } from 'lucide-react';
import { Link, NavLink, Outlet } from 'react-router-dom';

import { Button } from '@/shared/ui/Button';

const adminNav = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/produtos', label: 'Camisas', icon: Package },
  { href: '/admin/pedidos', label: 'Pedidos', icon: ReceiptText },
  { href: '/admin/usuarios', label: 'Clientes', icon: UsersRound },
];

export function AdminLayout() {
  return (
    <div className="min-h-dvh bg-bg-base">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-border bg-bg-elevated p-6 lg:block">
        <Link to="/" className="font-display text-xl font-bold">
          Camisaria <span className="text-accent">Admin</span>
        </Link>
        <nav className="mt-10 space-y-2" aria-label="Navegacao administrativa">
          {adminNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.href === '/admin'}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold transition ${
                    isActive ? 'bg-accent text-accent-fg' : 'text-fg-secondary hover:bg-bg-overlay hover:text-fg-primary'
                  }`
                }
              >
                <Icon className="size-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
        <Button asChild className="mt-10" variant="secondary" fullWidth>
          <Link to="/">Voltar para loja</Link>
        </Button>
      </aside>
      <div className="lg:pl-72">
        <header className="border-b border-border bg-bg-base/85 p-4 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between">
            <Link to="/" className="font-display text-lg font-bold">
              Camisaria Admin
            </Link>
            <Button asChild variant="secondary" size="sm">
              <Link to="/">Loja</Link>
            </Button>
          </div>
        </header>
        <main className="container-app py-8 lg:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
