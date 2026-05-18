import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Pencil, Plus, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { createProduto, fetchProdutos, updateProduto } from '@/features/catalog/api/produtosApi';
import type { ProdutoResponseDTO } from '@/shared/api/types';
import { formatCurrency } from '@/shared/lib/formatters';
import { Button } from '@/shared/ui/Button';
import { DataTable, type Column } from '@/shared/ui/DataTable';
import { EmptyState } from '@/shared/ui/EmptyState';
import { Field } from '@/shared/ui/Field';
import { Input } from '@/shared/ui/Input';
import { Modal } from '@/shared/ui/Modal';
import { useToast } from '@/shared/ui/Toast';

const optionalImageUrl = z
  .string()
  .trim()
  .url('Informe uma URL valida (https://...)')
  .optional()
  .or(z.literal('').transform(() => undefined));

const createSchema = z.object({
  nome: z.string().min(1, 'Informe o nome'),
  descricao: z.string().min(1, 'Informe a descricao'),
  precoBase: z.coerce.number().positive('Informe um preco maior que zero'),
  imagemUrl: optionalImageUrl,
  tamanho: z.string().min(1, 'Informe o tamanho'),
  cor: z.string().min(1, 'Informe a cor'),
  estoqueInicial: z.coerce.number().min(0, 'Estoque nao pode ser negativo'),
});

const editSchema = z.object({
  nome: z.string().min(1, 'Informe o nome'),
  descricao: z.string().min(1, 'Informe a descricao'),
  precoBase: z.coerce.number().positive('Informe um preco maior que zero'),
  imagemUrl: optionalImageUrl,
  ativo: z.boolean(),
  destaque: z.boolean(),
});

type CreateValues = z.infer<typeof createSchema>;
type EditValues = z.infer<typeof editSchema>;

export function AdminProductsPage() {
  const [page, setPage] = useState(0);
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<ProdutoResponseDTO | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const produtosQuery = useQuery({
    queryKey: ['admin-produtos', page],
    queryFn: () => fetchProdutos({ page, size: 10, sort: 'nome' }),
  });

  const createForm = useForm<CreateValues>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      nome: '',
      descricao: '',
      precoBase: 0,
      imagemUrl: '',
      tamanho: '',
      cor: '',
      estoqueInicial: 0,
    },
  });

  const editForm = useForm<EditValues>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      nome: '',
      descricao: '',
      precoBase: 0,
      imagemUrl: '',
      ativo: true,
      destaque: false,
    },
  });

  useEffect(() => {
    if (editing) {
      editForm.reset({
        nome: editing.nome,
        descricao: editing.descricao,
        precoBase: editing.precoBase,
        imagemUrl: editing.imagemUrl ?? '',
        ativo: editing.ativo,
        destaque: editing.destaque,
      });
    }
  }, [editForm, editing]);

  const invalidateProdutos = async () => {
    await queryClient.invalidateQueries({ queryKey: ['admin-produtos'] });
    await queryClient.invalidateQueries({ queryKey: ['produtos'] });
    await queryClient.invalidateQueries({ queryKey: ['produtos', 'destaques'] });
  };

  const createMutation = useMutation({
    mutationFn: createProduto,
    onSuccess: async () => {
      toast.success('Camisa cadastrada');
      setCreateOpen(false);
      createForm.reset();
      await invalidateProdutos();
    },
    onError: () => {
      toast.error('Nao foi possivel cadastrar a camisa', {
        description: 'Confira os dados e se voce esta logado como admin.',
      });
    },
  });

  const editMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: EditValues }) => updateProduto(id, payload),
    onSuccess: async () => {
      toast.success('Camisa atualizada');
      setEditing(null);
      await invalidateProdutos();
    },
    onError: () => {
      toast.error('Nao foi possivel atualizar a camisa', {
        description: 'Confira os dados e tente novamente.',
      });
    },
  });

  const columns: Column<ProdutoResponseDTO>[] = [
    { key: 'id', header: 'ID', width: 80 },
    {
      key: 'imagemUrl',
      header: 'Imagem',
      width: 80,
      render: (row) =>
        row.imagemUrl ? (
          <img
            src={row.imagemUrl}
            alt=""
            loading="lazy"
            className="size-12 rounded-md border border-border object-cover"
          />
        ) : (
          <div className="grid size-12 place-items-center rounded-md border border-border bg-bg-overlay text-xs text-fg-muted">
            sem
          </div>
        ),
    },
    { key: 'nome', header: 'Camisa', sortable: true },
    { key: 'precoBase', header: 'Preco', render: (row) => formatCurrency(row.precoBase) },
    { key: 'ativo', header: 'Status', render: (row) => (row.ativo ? 'Ativo' : 'Inativo') },
    {
      key: 'destaque',
      header: 'Destaque',
      width: 110,
      render: (row) =>
        row.destaque ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-accent/40 bg-accent/10 px-2 py-1 text-xs font-semibold text-accent">
            <Star className="size-3" /> Sim
          </span>
        ) : (
          <span className="text-xs text-fg-muted">--</span>
        ),
    },
    {
      key: 'acoes',
      header: 'Acoes',
      align: 'right',
      width: 120,
      render: (row) => (
        <Button
          size="sm"
          variant="secondary"
          leftIcon={<Pencil className="size-4" />}
          onClick={() => setEditing(row)}
        >
          Editar
        </Button>
      ),
    },
  ];

  return (
    <section>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">Admin</p>
          <h1 className="mt-2 font-display text-5xl font-bold tracking-tight">Camisas</h1>
          <p className="mt-3 text-fg-secondary">Cadastre novos modelos e gerencie o que ja esta na vitrine.</p>
        </div>
        <Modal open={createOpen} onOpenChange={setCreateOpen}>
          <Modal.Trigger asChild>
            <Button leftIcon={<Plus className="size-4" />}>Nova camisa</Button>
          </Modal.Trigger>
          <Modal.Content size="lg">
            <Modal.Header>
              <Modal.Title className="font-display text-2xl font-semibold">Cadastrar camisa</Modal.Title>
              <Modal.Description className="text-sm text-fg-secondary">
                Informe nome, foto, preco e o primeiro tamanho/cor disponivel.
              </Modal.Description>
            </Modal.Header>
            <Modal.Body>
              <form
                className="grid gap-5 sm:grid-cols-2"
                onSubmit={createForm.handleSubmit((values) => createMutation.mutate(values))}
              >
                <Field label="Nome" htmlFor="nome" error={createForm.formState.errors.nome?.message} required>
                  <Input id="nome" {...createForm.register('nome')} />
                </Field>
                <Field label="Preco base" htmlFor="precoBase" error={createForm.formState.errors.precoBase?.message} required>
                  <Input id="precoBase" type="number" step="0.01" {...createForm.register('precoBase')} />
                </Field>
                <Field
                  label="Descricao"
                  htmlFor="descricao"
                  error={createForm.formState.errors.descricao?.message}
                  required
                  className="sm:col-span-2"
                >
                  <Input id="descricao" {...createForm.register('descricao')} />
                </Field>
                <Field
                  label="URL da imagem"
                  htmlFor="imagemUrl"
                  error={createForm.formState.errors.imagemUrl?.message}
                  hint="Cole a URL publica da foto da camisa (ex: https://...)."
                  className="sm:col-span-2"
                >
                  <Input id="imagemUrl" placeholder="https://..." {...createForm.register('imagemUrl')} />
                </Field>
                <Field label="Tamanho" htmlFor="tamanho" error={createForm.formState.errors.tamanho?.message} required>
                  <Input id="tamanho" {...createForm.register('tamanho')} />
                </Field>
                <Field label="Cor" htmlFor="cor" error={createForm.formState.errors.cor?.message} required>
                  <Input id="cor" {...createForm.register('cor')} />
                </Field>
                <Field
                  label="Estoque inicial"
                  htmlFor="estoqueInicial"
                  error={createForm.formState.errors.estoqueInicial?.message}
                  required
                >
                  <Input id="estoqueInicial" type="number" {...createForm.register('estoqueInicial')} />
                </Field>
                <div className="flex items-end justify-end gap-3 sm:col-span-2">
                  <Modal.Close asChild>
                    <Button type="button" variant="ghost">
                      Cancelar
                    </Button>
                  </Modal.Close>
                  <Button type="submit" isLoading={createMutation.isPending}>
                    Salvar
                  </Button>
                </div>
              </form>
            </Modal.Body>
          </Modal.Content>
        </Modal>
      </div>

      <Modal open={Boolean(editing)} onOpenChange={(next) => (next ? undefined : setEditing(null))}>
        <Modal.Content size="lg">
          <Modal.Header>
            <Modal.Title className="font-display text-2xl font-semibold">Editar camisa</Modal.Title>
            <Modal.Description className="text-sm text-fg-secondary">
              {editing
                ? `Atualize os dados da camisa #${editing.id}. Tamanhos e estoque sao gerenciados a parte.`
                : 'Atualize os dados da camisa.'}
            </Modal.Description>
          </Modal.Header>
          <Modal.Body>
            <form
              className="grid gap-5 sm:grid-cols-2"
              onSubmit={editForm.handleSubmit((values) => {
                if (!editing) return;
                editMutation.mutate({ id: editing.id, payload: values });
              })}
            >
              <Field label="Nome" htmlFor="edit-nome" error={editForm.formState.errors.nome?.message} required>
                <Input id="edit-nome" {...editForm.register('nome')} />
              </Field>
              <Field
                label="Preco base"
                htmlFor="edit-precoBase"
                error={editForm.formState.errors.precoBase?.message}
                required
              >
                <Input id="edit-precoBase" type="number" step="0.01" {...editForm.register('precoBase')} />
              </Field>
              <Field
                label="Descricao"
                htmlFor="edit-descricao"
                error={editForm.formState.errors.descricao?.message}
                required
                className="sm:col-span-2"
              >
                <Input id="edit-descricao" {...editForm.register('descricao')} />
              </Field>
              <Field
                label="URL da imagem"
                htmlFor="edit-imagemUrl"
                error={editForm.formState.errors.imagemUrl?.message}
                hint="Cole a URL publica da foto da camisa (ex: https://...). Deixe em branco para remover."
                className="sm:col-span-2"
              >
                <Input id="edit-imagemUrl" placeholder="https://..." {...editForm.register('imagemUrl')} />
              </Field>
              <label
                htmlFor="edit-ativo"
                className="flex items-center gap-3 rounded-md border border-border bg-bg-overlay p-3 text-sm sm:col-span-2"
              >
                <input
                  id="edit-ativo"
                  type="checkbox"
                  className="size-4 accent-accent"
                  {...editForm.register('ativo')}
                />
                <span>
                  <span className="font-semibold text-fg-primary">Camisa ativa</span>
                  <span className="ml-2 text-fg-secondary">
                    Quando inativa, ela nao aparece na vitrine para os clientes.
                  </span>
                </span>
              </label>
              <label
                htmlFor="edit-destaque"
                className="flex items-center gap-3 rounded-md border border-border bg-bg-overlay p-3 text-sm sm:col-span-2"
              >
                <input
                  id="edit-destaque"
                  type="checkbox"
                  className="size-4 accent-accent"
                  {...editForm.register('destaque')}
                />
                <span className="flex-1">
                  <span className="flex items-center gap-2 font-semibold text-fg-primary">
                    <Star className="size-4 text-accent" /> Destacar na home
                  </span>
                  <span className="mt-1 block text-fg-secondary">
                    Camisas destacadas entram no carrossel da pagina inicial.
                  </span>
                </span>
              </label>
              <div className="flex items-end justify-end gap-3 sm:col-span-2">
                <Button type="button" variant="ghost" onClick={() => setEditing(null)}>
                  Cancelar
                </Button>
                <Button type="submit" isLoading={editMutation.isPending}>
                  Salvar alteracoes
                </Button>
              </div>
            </form>
          </Modal.Body>
        </Modal.Content>
      </Modal>

      <DataTable
        columns={columns}
        data={produtosQuery.data?.content ?? []}
        isLoading={produtosQuery.isLoading}
        page={produtosQuery.data?.number ?? page}
        pageSize={produtosQuery.data?.size ?? 10}
        totalElements={produtosQuery.data?.totalElements ?? 0}
        onPageChange={setPage}
        rowKey={(row) => row.id}
        emptyState={
          <EmptyState
            title="Nenhuma camisa cadastrada"
            action={{ label: 'Cadastrar camisa', onClick: () => setCreateOpen(true) }}
          />
        }
      />
    </section>
  );
}
