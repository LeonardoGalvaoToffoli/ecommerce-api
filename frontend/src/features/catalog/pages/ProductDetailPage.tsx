import { ChevronLeft, ShoppingBag } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';

import { fetchProduto } from '@/features/catalog/api/produtosApi';
import { useCartStore } from '@/features/cart/stores/cartStore';
import { formatCurrency } from '@/shared/lib/formatters';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { EmptyState } from '@/shared/ui/EmptyState';
import { Select } from '@/shared/ui/Select';
import { Skeleton } from '@/shared/ui/Skeleton';
import { useToast } from '@/shared/ui/Toast';

export function ProductDetailPage() {
  const { id } = useParams();
  const addItem = useCartStore((state) => state.addItem);
  const { toast } = useToast();
  const [selectedVariacaoId, setSelectedVariacaoId] = useState<string | undefined>();
  const [quantity, setQuantity] = useState(1);

  const { data: produto, isLoading } = useQuery({
    queryKey: ['produto', id],
    queryFn: () => fetchProduto(id!),
    enabled: Boolean(id),
  });

  const variations = useMemo(() => produto?.variacoes ?? [], [produto]);
  const selectedVariation = useMemo(() => {
    const target = selectedVariacaoId ?? String(variations.find((item) => item.quantidadeEstoque > 0)?.id ?? '');
    return variations.find((item) => String(item.id) === target);
  }, [selectedVariacaoId, variations]);

  if (isLoading) {
    return (
      <section className="container-app grid gap-10 py-12 lg:grid-cols-2">
        <Skeleton className="aspect-square w-full rounded-lg" />
        <div className="space-y-5">
          <Skeleton variant="text" width="30%" />
          <Skeleton variant="text" width="80%" />
          <Skeleton variant="text" width="60%" />
        </div>
      </section>
    );
  }

  if (!produto) {
    return (
      <section className="container-app py-12">
        <EmptyState title="Camisa nao encontrada" action={{ label: 'Voltar para a colecao', href: '/produtos' }} />
      </section>
    );
  }

  const canAdd = selectedVariation && selectedVariation.quantidadeEstoque >= quantity;

  return (
    <section className="container-app py-12">
      <Button asChild variant="ghost" leftIcon={<ChevronLeft className="size-4" />}>
        <Link to="/produtos">Voltar para camisas</Link>
      </Button>
      <div className="mt-8 grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="aspect-square overflow-hidden rounded-[2rem] border border-border bg-bg-elevated">
          {produto.imagemUrl ? (
            <img
              src={produto.imagemUrl}
              alt={produto.nome}
              loading="lazy"
              decoding="async"
              className="size-full object-cover"
            />
          ) : (
            <div className="surface-grid flex size-full items-center justify-center">
              <span className="font-display text-8xl font-bold text-fg-muted/20">{produto.nome.slice(0, 2)}</span>
            </div>
          )}
        </div>
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Badge variant={produto.ativo ? 'accent' : 'danger'}>{produto.ativo ? 'Disponivel' : 'Indisponivel'}</Badge>
          <h1 className="mt-5 font-display text-5xl font-bold tracking-tight">{produto.nome}</h1>
          <p className="mt-4 text-lg leading-8 text-fg-secondary">{produto.descricao}</p>
          <p className="mt-8 font-display text-4xl font-bold text-accent">{formatCurrency(produto.precoBase)}</p>

          <div className="mt-8 space-y-5 rounded-lg border border-border bg-bg-elevated p-5">
            <div>
              <label htmlFor="variation" className="mb-2 block text-sm font-semibold">
                Tamanho e cor
              </label>
              <Select
                id="variation"
                value={selectedVariacaoId}
                onValueChange={setSelectedVariacaoId}
                placeholder="Escolha tamanho e cor"
                options={variations.map((variation) => ({
                  value: String(variation.id),
                  label: `${variation.tamanho} · ${variation.cor} (${variation.quantidadeEstoque} em estoque)`,
                  disabled: variation.quantidadeEstoque <= 0,
                }))}
              />
            </div>
            <div>
              <label htmlFor="quantity" className="mb-2 block text-sm font-semibold">
                Quantidade
              </label>
              <input
                id="quantity"
                type="number"
                min={1}
                max={selectedVariation?.quantidadeEstoque ?? 1}
                value={quantity}
                className="h-11 w-28 rounded-md border border-border bg-bg-overlay px-4 text-base"
                onChange={(event) => setQuantity(Math.max(1, Number(event.target.value)))}
              />
            </div>
            <Button
              fullWidth
              size="lg"
              disabled={!canAdd}
              leftIcon={<ShoppingBag className="size-5" />}
              onClick={() => {
                if (!selectedVariation) return;
                addItem({
                  produtoId: produto.id,
                  variacaoId: selectedVariation.id,
                  nome: produto.nome,
                  variacaoLabel: `${selectedVariation.tamanho} · ${selectedVariation.cor}`,
                  precoUnit: produto.precoBase,
                  quantidade: quantity,
                  imagemUrl: produto.imagemUrl ?? undefined,
                });
                toast.success('Camisa adicionada ao carrinho');
              }}
            >
              Adicionar ao carrinho
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
