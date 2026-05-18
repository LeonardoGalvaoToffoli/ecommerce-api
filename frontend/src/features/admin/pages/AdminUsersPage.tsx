import { UsersRound } from 'lucide-react';

import { EmptyState } from '@/shared/ui/EmptyState';

export function AdminUsersPage() {
  return (
    <section>
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">Admin</p>
        <h1 className="mt-2 font-display text-5xl font-bold tracking-tight">Clientes</h1>
      </div>
      <EmptyState
        icon={<UsersRound className="size-10" />}
        title="Listagem de clientes em breve"
        description="Por enquanto, voce pode cadastrar novos administradores em Criar conta. A lista de clientes vai aparecer aqui em uma proxima entrega."
      />
    </section>
  );
}
