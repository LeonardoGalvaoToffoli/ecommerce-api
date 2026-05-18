import { Search } from 'lucide-react';
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';

import { fetchProdutos } from '@/features/catalog/api/produtosApi';
import { useAddProductToCart } from '@/features/cart/hooks/useAddProductToCart';
import { ProductCard, ProductCardSkeleton } from '@/features/catalog/components/ProductCard';
import { Input } from '@/shared/ui/Input';
import { EmptyState } from '@/shared/ui/EmptyState';
import { Pagination } from '@/shared/ui/Pagination';

export function ProductsPage() {
  const [params, setParams] = useSearchParams();
  const page = Number(params.get('page') ?? 0);
  const query = params.get('q') ?? '';
  const addProduct = useAddProductToCart();

  const { data, isLoading } = useQuery({
    queryKey: ['produtos', { page }],
    queryFn: () => fetchProdutos({ page, size: 20, sort: 'nome' }),
  });

  const products = useMemo(() => {
    const content = data?.content ?? [];
    if (!query) return content;
    return content.filter((produto) => produto.nome.toLowerCase().includes(query.toLowerCase()));
  }, [data?.content, query]);

  return (
    <section className="container-app py-12">
      <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">Colecao</p>
          <h1 className="mt-2 font-display text-5xl font-bold tracking-tight">Todas as camisas</h1>
          <p className="mt-3 max-w-2xl text-fg-secondary">
            Modelos basicos, estampados e oversized. Filtre pelo nome pra achar o que procura.
          </p>
        </div>
        <div className="w-full lg:w-96">
          <Input
            value={query}
            placeholder="Buscar camisa pelo nome"
            leftAdornment={<Search className="size-4" />}
            onChange={(event) => {
              const next = new URLSearchParams(params);
              if (event.target.value) next.set('q', event.target.value);
              else next.delete('q');
              next.set('page', '0');
              setParams(next);
            }}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 12 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      ) : products.length ? (
        <>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {products.map((produto) => (
              <ProductCard key={produto.id} produto={produto} onAddToCart={(id) => addProduct.mutate(id)} />
            ))}
          </div>
          <div className="mt-10">
            <Pagination
              page={data?.number ?? page}
              pageSize={data?.size ?? 20}
              totalElements={data?.totalElements ?? 0}
              onPageChange={(nextPage) => {
                const next = new URLSearchParams(params);
                next.set('page', String(nextPage));
                setParams(next);
              }}
            />
          </div>
        </>
      ) : (
        <EmptyState
          title="Nenhuma camisa encontrada"
          description="Tente outro termo na busca ou volte depois que novos modelos chegarem."
          action={{ label: 'Limpar busca', onClick: () => setParams({ page: '0' }) }}
        />
      )}
    </section>
  );
}
