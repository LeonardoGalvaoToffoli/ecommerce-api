import { useQuery } from '@tanstack/react-query';
import { LogOut, Package, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { getPerfil } from '@/features/auth/api/authApi';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { fetchMeusPedidos } from '@/features/checkout/api/checkoutApi';
import { OrderStatusBadge } from '@/features/orders/components/OrderStatusBadge';
import { formatCurrency, getInitials } from '@/shared/lib/formatters';
import { Button } from '@/shared/ui/Button';
import { EmptyState } from '@/shared/ui/EmptyState';
import { Skeleton } from '@/shared/ui/Skeleton';

export function AccountPage() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const perfilQuery = useQuery({ queryKey: ['perfil'], queryFn: getPerfil });
  const pedidosQuery = useQuery({ queryKey: ['meus-pedidos'], queryFn: fetchMeusPedidos });

  return (
    <section className="container-app py-12">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">Minha conta</p>
          <h1 className="mt-2 font-display text-5xl font-bold tracking-tight">Suas camisas e seus pedidos</h1>
        </div>
        <Button
          variant="secondary"
          leftIcon={<LogOut className="size-4" />}
          onClick={() => {
            logout();
            navigate('/');
          }}
        >
          Sair
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <aside className="rounded-lg border border-border bg-bg-elevated p-6">
          {perfilQuery.isLoading ? (
            <Skeleton variant="text" lines={4} />
          ) : perfilQuery.data ? (
            <>
              <div className="grid size-20 place-items-center rounded-full bg-accent font-display text-2xl font-bold text-accent-fg">
                {getInitials(perfilQuery.data.nome)}
              </div>
              <h2 className="mt-5 font-display text-2xl font-semibold">{perfilQuery.data.nome}</h2>
              <p className="mt-1 text-sm text-fg-secondary">{perfilQuery.data.email}</p>
              <div className="mt-6 space-y-2 text-sm text-fg-secondary">
                <p>CPF: {perfilQuery.data.cpf}</p>
                <p>Telefone: {perfilQuery.data.telefone}</p>
              </div>
            </>
          ) : (
            <EmptyState icon={<UserRound className="size-8" />} title="Nao conseguimos carregar seu perfil" />
          )}
        </aside>

        <div className="rounded-lg border border-border bg-bg-elevated p-6">
          <h2 className="mb-5 flex items-center gap-2 font-display text-2xl font-semibold">
            <Package className="size-5 text-accent" /> Meus pedidos
          </h2>
          {pedidosQuery.isLoading ? (
            <Skeleton variant="text" lines={5} />
          ) : pedidosQuery.data?.length ? (
            <div className="divide-y divide-border">
              {pedidosQuery.data.map((pedido) => (
                <div key={pedido.pedidoId} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold">Pedido #{pedido.pedidoId}</p>
                    <p className="text-sm text-fg-secondary">{formatCurrency(pedido.valorTotal)}</p>
                  </div>
                  <OrderStatusBadge status={pedido.statusPedido} />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Voce ainda nao fez nenhum pedido"
              description="Quando comprar sua primeira camisa, o historico aparece aqui."
              action={{ label: 'Ver camisas', href: '/produtos' }}
            />
          )}
        </div>
      </div>
    </section>
  );
}
