import { ReceiptText } from 'lucide-react';

import { EmptyState } from '@/shared/ui/EmptyState';

export function AdminOrdersPage() {
  return (
    <section>
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">Admin</p>
        <h1 className="mt-2 font-display text-5xl font-bold tracking-tight">Pedidos</h1>
      </div>
      <EmptyState
        icon={<ReceiptText className="size-10" />}
        title="Listagem de pedidos em breve"
        description="A tabela de pedidos vai entrar aqui assim que o backend liberar o endpoint admin."
      />
    </section>
  );
}
