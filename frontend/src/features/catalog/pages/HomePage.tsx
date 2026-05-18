import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { fetchDestaques, fetchProdutos } from '@/features/catalog/api/produtosApi';
import { FeaturedCarousel } from '@/features/catalog/components/FeaturedCarousel';
import { ProductCard, ProductCardSkeleton } from '@/features/catalog/components/ProductCard';
import { useAddProductToCart } from '@/features/cart/hooks/useAddProductToCart';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { EmptyState } from '@/shared/ui/EmptyState';

export function HomePage() {
  const addProduct = useAddProductToCart();
  const { data, isLoading } = useQuery({
    queryKey: ['produtos', 'home'],
    queryFn: () => fetchProdutos({ page: 0, size: 8, sort: 'nome' }),
  });
  const destaquesQuery = useQuery({
    queryKey: ['produtos', 'destaques'],
    queryFn: fetchDestaques,
  });

  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <div className="surface-grid absolute inset-0 opacity-40" aria-hidden="true" />
        <div className="container-app relative grid min-h-[680px] items-center gap-12 py-20 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="max-w-4xl animate-enterUp">
            <Badge variant="accent" dot>
              Nova colecao no ar
            </Badge>
            <h1 className="mt-6 font-display text-5xl font-bold tracking-[-0.06em] text-fg-primary sm:text-7xl lg:text-8xl">
              Camisas com caimento bom e estampa que voce vai querer usar todo dia.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-fg-secondary">
              Algodao macio, cores que nao desbotam e tamanhos do P ao GG. Escolha o seu modelo, finalize com PIX e a gente entrega pra todo Brasil.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" rightIcon={<ArrowRight className="size-5" />}>
                <Link to="/produtos">Ver todas as camisas</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link to="/entrar">Entrar na conta</Link>
              </Button>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <FeaturedCarousel
              produtos={destaquesQuery.data ?? []}
              isLoading={destaquesQuery.isLoading}
            />
          </div>
        </div>
      </section>

      <section className="container-app py-16">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">Em alta</p>
            <h2 className="mt-2 font-display text-4xl font-bold tracking-tight">Camisas em destaque</h2>
          </div>
          <Button asChild variant="ghost" rightIcon={<ArrowRight className="size-4" />}>
            <Link to="/produtos">Ver tudo</Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        ) : data?.content.length ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {data.content.map((produto, index) => (
              <ProductCard
                key={produto.id}
                produto={produto}
                badge={index === 0 ? 'novo' : undefined}
                onAddToCart={(id) => addProduct.mutate(id)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="A vitrine esta vazia"
            description="Estamos preparando a proxima colecao. Volte em instantes, camisas novas chegam ja ja."
          />
        )}
      </section>
    </>
  );
}
