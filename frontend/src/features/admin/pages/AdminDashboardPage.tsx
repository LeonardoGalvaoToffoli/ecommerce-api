import { useQuery } from '@tanstack/react-query';
import { Package, ReceiptText, Sparkles, UsersRound } from 'lucide-react';

import { fetchProdutos } from '@/features/catalog/api/produtosApi';
import { Badge } from '@/shared/ui/Badge';
import { Skeleton } from '@/shared/ui/Skeleton';

function MetricCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-bg-elevated p-6">
      <div className="mb-4 text-accent">{icon}</div>
      <p className="text-sm text-fg-secondary">{label}</p>
      <p className="mt-2 font-display text-4xl font-bold">{value}</p>
    </div>
  );
}

export function AdminDashboardPage() {
  const produtosQuery = useQuery({
    queryKey: ['admin-produtos-overview'],
    queryFn: () => fetchProdutos({ page: 0, size: 1 }),
  });

  return (
    <section>
      <div className="mb-8">
        <Badge variant="accent" dot>
          Painel da loja
        </Badge>
        <h1 className="mt-4 font-display text-5xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-3 max-w-2xl text-fg-secondary">
          Visao rapida da sua camisaria. Cadastro de camisas ja esta no ar; pedidos e clientes vao entrar conforme a operacao crescer.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={<Package className="size-6" />}
          label="Camisas cadastradas"
          value={produtosQuery.isLoading ? <Skeleton variant="text" width={80} /> : produtosQuery.data?.totalElements ?? 0}
        />
        <MetricCard icon={<ReceiptText className="size-6" />} label="Pedidos hoje" value="--" />
        <MetricCard icon={<Sparkles className="size-6" />} label="Receita 7d" value="--" />
        <MetricCard icon={<UsersRound className="size-6" />} label="Clientes" value="--" />
      </div>
    </section>
  );
}
