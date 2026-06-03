import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, ReceiptText } from 'lucide-react';
import { useState } from 'react';

import { fetchPedidosAdmin, simularPixPagoAdmin } from '@/features/checkout/api/checkoutApi';
import { OrderStatusBadge } from '@/features/orders/components/OrderStatusBadge';
import type { PedidoAdminDTO } from '@/shared/api/types';
import { formatCurrency } from '@/shared/lib/formatters';
import { Button } from '@/shared/ui/Button';
import { DataTable, type Column } from '@/shared/ui/DataTable';
import { EmptyState } from '@/shared/ui/EmptyState';
import { useToast } from '@/shared/ui/Toast';

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function AdminOrdersPage() {
  const [page, setPage] = useState(0);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const pedidosQuery = useQuery({
    queryKey: ['admin-pedidos', page],
    queryFn: () => fetchPedidosAdmin({ page, size: 10, sort: 'dataPedido,desc' }),
  });

  const simularMutation = useMutation({
    mutationFn: simularPixPagoAdmin,
    onSuccess: async () => {
      toast.success('Pagamento confirmado', {
        description: 'Pedido marcado como pago e evento disparado para a esteira.',
      });
      await queryClient.invalidateQueries({ queryKey: ['admin-pedidos'] });
      await queryClient.invalidateQueries({ queryKey: ['meus-pedidos'] });
    },
    onError: () => {
      toast.error('Nao foi possivel simular o PIX', {
        description: 'Confira se o pedido tem pagamento associado.',
      });
    },
  });

  const columns: Column<PedidoAdminDTO>[] = [
    { key: 'pedidoId', header: '#', width: 70 },
    {
      key: 'dataPedido',
      header: 'Data',
      width: 160,
      render: (row) => <span className="text-sm text-fg-secondary">{formatDate(row.dataPedido)}</span>,
    },
    {
      key: 'clienteNome',
      header: 'Cliente',
      render: (row) => (
        <div>
          <div className="font-semibold text-fg-primary">{row.clienteNome}</div>
          <div className="text-xs text-fg-muted">{row.clienteEmail}</div>
        </div>
      ),
    },
    {
      key: 'valorTotal',
      header: 'Total',
      width: 120,
      render: (row) => <span className="font-semibold">{formatCurrency(row.valorTotal)}</span>,
    },
    {
      key: 'statusPedido',
      header: 'Status',
      width: 180,
      render: (row) => <OrderStatusBadge status={row.statusPedido} />,
    },
    {
      key: 'acoes',
      header: 'Acoes',
      align: 'right',
      width: 200,
      render: (row) => {
        if (row.statusPedido !== 'AGUARDANDO_PAGAMENTO') {
          return <span className="text-xs text-fg-muted">--</span>;
        }
        const carregando =
          simularMutation.isPending && simularMutation.variables === row.pedidoId;
        return (
          <Button
            size="sm"
            variant="secondary"
            leftIcon={<CheckCircle2 className="size-4" />}
            isLoading={carregando}
            onClick={() => simularMutation.mutate(row.pedidoId)}
          >
            Simular PIX pago
          </Button>
        );
      },
    },
  ];

  return (
    <section>
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">Admin</p>
        <h1 className="mt-2 font-display text-5xl font-bold tracking-tight">Pedidos</h1>
        <p className="mt-3 max-w-2xl text-fg-secondary">
          Lista de todos os pedidos da loja. Use "Simular PIX pago" para confirmar manualmente um pagamento
          em pedidos aguardando — a esteira pos-pagamento (estoque, NF, entrega) e disparada.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={pedidosQuery.data?.content ?? []}
        isLoading={pedidosQuery.isLoading}
        page={pedidosQuery.data?.number ?? page}
        pageSize={pedidosQuery.data?.size ?? 10}
        totalElements={pedidosQuery.data?.totalElements ?? 0}
        onPageChange={setPage}
        rowKey={(row) => row.pedidoId}
        emptyState={
          <EmptyState
            icon={<ReceiptText className="size-10" />}
            title="Nenhum pedido por enquanto"
            description="Assim que sua primeira venda for finalizada, ela aparece aqui."
          />
        }
      />
    </section>
  );
}
