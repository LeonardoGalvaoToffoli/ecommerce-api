import { ShoppingBag } from 'lucide-react';
import { memo } from 'react';
import { Link } from 'react-router-dom';

import type { ProdutoResponseDTO } from '@/shared/api/types';
import { formatCurrency } from '@/shared/lib/formatters';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { Skeleton } from '@/shared/ui/Skeleton';

export interface ProductCardProps {
  produto: ProdutoResponseDTO;
  href?: string;
  imagemUrl?: string;
  onAddToCart?: (id: number) => void;
  badge?: 'novo' | 'esgotado' | 'promocao';
  loading?: boolean;
}

export function ProductCardSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="aspect-square w-full rounded-lg" />
      <Skeleton variant="text" width="80%" />
      <Skeleton variant="text" width="45%" />
    </div>
  );
}

function ProductCardComponent({
  badge,
  href,
  imagemUrl,
  loading,
  onAddToCart,
  produto,
}: ProductCardProps) {
  if (loading) return <ProductCardSkeleton />;

  const isSoldOut = badge === 'esgotado' || !produto.ativo;
  const productHref = href ?? `/produto/${produto.id}`;
  const resolvedImage = imagemUrl ?? produto.imagemUrl ?? undefined;

  return (
    <article className="group relative overflow-hidden rounded-lg border border-border bg-bg-elevated transition duration-base ease-standard hover:-translate-y-1 hover:border-fg-muted hover:shadow-md">
      <Link to={productHref} className="block focus:outline-none">
        <div className="relative aspect-square overflow-hidden bg-bg-overlay">
          {resolvedImage ? (
            <img
              src={resolvedImage}
              alt={produto.nome}
              loading="lazy"
              decoding="async"
              className="size-full object-cover transition duration-slow ease-standard group-hover:scale-[1.03]"
            />
          ) : (
            <div className="surface-grid flex size-full items-center justify-center bg-bg-overlay">
              <span className="font-display text-5xl font-bold text-fg-muted/30">{produto.nome.slice(0, 2)}</span>
            </div>
          )}
          {badge ? (
            <Badge
              className="absolute left-3 top-3"
              variant={badge === 'esgotado' ? 'danger' : badge === 'promocao' ? 'warning' : 'accent'}
            >
              {badge}
            </Badge>
          ) : null}
        </div>
        <div className="space-y-2 p-4">
          <h3 className="line-clamp-2 font-display text-lg font-semibold text-fg-primary">{produto.nome}</h3>
          <p className="line-clamp-2 text-sm text-fg-secondary">{produto.descricao}</p>
          <p className="text-lg font-bold text-accent">{formatCurrency(produto.precoBase)}</p>
        </div>
      </Link>
      <div className="p-4 pt-0">
        <Button
          fullWidth
          disabled={isSoldOut}
          leftIcon={<ShoppingBag className="size-4" />}
          variant={isSoldOut ? 'secondary' : 'primary'}
          aria-label={`Adicionar ${produto.nome} ao carrinho`}
          onClick={() => onAddToCart?.(produto.id)}
        >
          {isSoldOut ? 'Esgotado' : 'Adicionar'}
        </Button>
      </div>
    </article>
  );
}

export const ProductCard = memo(ProductCardComponent);
