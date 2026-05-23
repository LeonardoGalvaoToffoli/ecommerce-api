import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, ShieldCheck, UserCheck, UserX, UsersRound } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { fetchAdmins, registerAdmin, setAdminAtivo } from '@/features/auth/api/authApi';
import { useAuthStore } from '@/features/auth/stores/authStore';
import type { UsuarioResponseDTO } from '@/shared/api/types';
import { Button } from '@/shared/ui/Button';
import { DataTable, type Column } from '@/shared/ui/DataTable';
import { EmptyState } from '@/shared/ui/EmptyState';
import { Field } from '@/shared/ui/Field';
import { Input } from '@/shared/ui/Input';
import { Modal } from '@/shared/ui/Modal';
import { useToast } from '@/shared/ui/Toast';

const newAdminSchema = z.object({
  nome: z.string().min(2, 'Informe o nome'),
  email: z.string().email('Informe um e-mail valido'),
  senha: z.string().min(6, 'Use pelo menos 6 caracteres'),
  cpf: z.string().min(11, 'Informe um CPF valido'),
  telefone: z.string().min(8, 'Informe um telefone valido'),
});

type NewAdminValues = z.infer<typeof newAdminSchema>;

export function AdminUsersPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const meuId = useAuthStore((state) => state.user?.id);
  const [open, setOpen] = useState(false);

  const adminsQuery = useQuery({
    queryKey: ['admin-usuarios'],
    queryFn: fetchAdmins,
  });

  const form = useForm<NewAdminValues>({
    resolver: zodResolver(newAdminSchema),
    defaultValues: { nome: '', email: '', senha: '', cpf: '', telefone: '' },
  });

  const createMutation = useMutation({
    mutationFn: registerAdmin,
    onSuccess: async () => {
      toast.success('Admin cadastrado');
      setOpen(false);
      form.reset();
      await queryClient.invalidateQueries({ queryKey: ['admin-usuarios'] });
    },
    onError: () => {
      toast.error('Nao foi possivel cadastrar', {
        description: 'Confira se o e-mail ou CPF ja nao esta em uso.',
      });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, ativo }: { id: number; ativo: boolean }) => setAdminAtivo(id, ativo),
    onSuccess: async (_, variables) => {
      toast.success(variables.ativo ? 'Admin reativado' : 'Admin desativado');
      await queryClient.invalidateQueries({ queryKey: ['admin-usuarios'] });
    },
    onError: () => {
      toast.error('Nao foi possivel alterar o status', {
        description: 'Voce nao pode desativar o proprio usuario.',
      });
    },
  });

  const columns: Column<UsuarioResponseDTO>[] = [
    { key: 'id', header: 'ID', width: 70 },
    { key: 'nome', header: 'Nome', sortable: true },
    { key: 'email', header: 'E-mail' },
    {
      key: 'ativo',
      header: 'Status',
      width: 120,
      render: (row) =>
        row.ativo ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-success/40 bg-success/10 px-2 py-1 text-xs font-semibold text-success">
            <UserCheck className="size-3" /> Ativo
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full border border-danger/40 bg-danger/10 px-2 py-1 text-xs font-semibold text-danger">
            <UserX className="size-3" /> Inativo
          </span>
        ),
    },
    {
      key: 'acoes',
      header: 'Acoes',
      align: 'right',
      width: 160,
      render: (row) => {
        const eEu = row.id === meuId;
        if (eEu) {
          return <span className="text-xs text-fg-muted">voce</span>;
        }
        return (
          <Button
            size="sm"
            variant={row.ativo ? 'ghost' : 'secondary'}
            isLoading={toggleMutation.isPending && toggleMutation.variables?.id === row.id}
            onClick={() => toggleMutation.mutate({ id: row.id, ativo: !row.ativo })}
          >
            {row.ativo ? 'Desativar' : 'Reativar'}
          </Button>
        );
      },
    },
  ];

  return (
    <section>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">Acesso privado</p>
          <h1 className="mt-2 font-display text-5xl font-bold tracking-tight">Administradores</h1>
          <p className="mt-3 max-w-2xl text-fg-secondary">
            Gerencie quem tem acesso ao painel admin. Quando voce desativa um admin, ele perde acesso na hora — inclusive
            tokens ja emitidos param de funcionar.
          </p>
        </div>
        <Modal open={open} onOpenChange={setOpen}>
          <Modal.Trigger asChild>
            <Button leftIcon={<Plus className="size-4" />}>Novo admin</Button>
          </Modal.Trigger>
          <Modal.Content size="lg">
            <Modal.Header>
              <Modal.Title className="font-display text-2xl font-semibold">Cadastrar administrador</Modal.Title>
              <Modal.Description className="text-sm text-fg-secondary">
                <span className="inline-flex items-center gap-1 text-accent">
                  <ShieldCheck className="size-4" />
                </span>{' '}
                A nova conta tera acesso completo ao painel admin.
              </Modal.Description>
            </Modal.Header>
            <Modal.Body>
              <form
                className="grid gap-5 sm:grid-cols-2"
                onSubmit={form.handleSubmit((values) => createMutation.mutate(values))}
              >
                <Field label="Nome" htmlFor="adm-nome" error={form.formState.errors.nome?.message} required>
                  <Input id="adm-nome" autoComplete="name" {...form.register('nome')} />
                </Field>
                <Field label="E-mail" htmlFor="adm-email" error={form.formState.errors.email?.message} required>
                  <Input id="adm-email" type="email" autoComplete="email" {...form.register('email')} />
                </Field>
                <Field label="CPF" htmlFor="adm-cpf" error={form.formState.errors.cpf?.message} required>
                  <Input id="adm-cpf" {...form.register('cpf')} />
                </Field>
                <Field label="Telefone" htmlFor="adm-telefone" error={form.formState.errors.telefone?.message} required>
                  <Input id="adm-telefone" autoComplete="tel" {...form.register('telefone')} />
                </Field>
                <Field
                  label="Senha"
                  htmlFor="adm-senha"
                  error={form.formState.errors.senha?.message}
                  required
                  className="sm:col-span-2"
                >
                  <Input id="adm-senha" type="password" autoComplete="new-password" {...form.register('senha')} />
                </Field>
                <div className="flex items-end justify-end gap-3 sm:col-span-2">
                  <Modal.Close asChild>
                    <Button type="button" variant="ghost">
                      Cancelar
                    </Button>
                  </Modal.Close>
                  <Button type="submit" isLoading={createMutation.isPending}>
                    Cadastrar admin
                  </Button>
                </div>
              </form>
            </Modal.Body>
          </Modal.Content>
        </Modal>
      </div>

      <DataTable
        columns={columns}
        data={adminsQuery.data ?? []}
        isLoading={adminsQuery.isLoading}
        page={0}
        pageSize={adminsQuery.data?.length ?? 0}
        totalElements={adminsQuery.data?.length ?? 0}
        onPageChange={() => undefined}
        rowKey={(row) => row.id}
        emptyState={
          <EmptyState
            icon={<UsersRound className="size-10" />}
            title="Nenhum administrador cadastrado"
            action={{ label: 'Cadastrar admin', onClick: () => setOpen(true) }}
          />
        }
      />
    </section>
  );
}
