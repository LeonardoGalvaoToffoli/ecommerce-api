import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import type { ProdutoResponseDTO } from '@/shared/api/types';
import { formatCurrency } from '@/shared/lib/formatters';
import { IconButton } from '@/shared/ui/IconButton';
import { Skeleton } from '@/shared/ui/Skeleton';

interface FeaturedCarouselProps {
  produtos: ProdutoResponseDTO[];
  isLoading?: boolean;
  intervalMs?: number;
}

export function FeaturedCarousel({ produtos, isLoading, intervalMs = 5000 }: FeaturedCarouselProps) {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const total = produtos.length;
  const current = total ? produtos[index % total] : undefined;

  const goTo = useCallback(
    (next: number) => {
      if (!total) return;
      setIndex(((next % total) + total) % total);
    },
    [total],
  );

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    if (!total || isPaused || total <= 1) return;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % total), intervalMs);
    return () => window.clearInterval(timer);
  }, [intervalMs, isPaused, total]);

  if (isLoading) {
    return (
      <div className="aspect-[4/5] overflow-hidden rounded-[2rem] border border-border bg-bg-elevated p-4 shadow-md">
        <Skeleton className="size-full rounded-[1.5rem]" />
      </div>
    );
  }

  if (!current) {
    return (
      <div className="aspect-[4/5] rounded-[2rem] border border-border bg-bg-elevated p-4 shadow-md">
        <div className="surface-grid flex size-full flex-col justify-between rounded-[1.5rem] bg-bg-overlay p-8">
          <Sparkles className="size-10 text-accent" />
          <div>
            <p className="font-display text-5xl font-bold tracking-tight">01</p>
            <p className="mt-3 text-sm uppercase tracking-[0.35em] text-fg-muted">colecao essenciais</p>
            <p className="mt-2 text-xs text-fg-muted">
              O admin pode marcar camisas como destaque para aparecerem aqui.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-border bg-bg-elevated p-4 shadow-md"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-roledescription="carrossel"
      aria-label="Camisas em destaque selecionadas pelo admin"
    >
      <Link
        to={`/produto/${current.id}`}
        className="group relative block size-full overflow-hidden rounded-[1.5rem] bg-bg-overlay"
        aria-label={`Ver detalhes da camisa ${current.nome}`}
      >
        {current.imagemUrl ? (
          <img
            key={current.id}
            src={current.imagemUrl}
            alt={current.nome}
            loading="lazy"
            decoding="async"
            className="size-full object-cover transition duration-slow ease-standard group-hover:scale-[1.03]"
          />
        ) : (
          <div className="surface-grid flex size-full items-center justify-center">
            <span className="font-display text-7xl font-bold text-fg-muted/30">{current.nome.slice(0, 2)}</span>
          </div>
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-6 pt-16">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">colecao essenciais</p>
          <p className="mt-2 line-clamp-2 font-display text-2xl font-bold text-white">{current.nome}</p>
          <p className="mt-1 font-semibold text-white">{formatCurrency(current.precoBase)}</p>
        </div>
      </Link>

      {total > 1 ? (
        <>
          <div className="pointer-events-none absolute inset-x-4 top-1/2 flex -translate-y-1/2 justify-between">
            <IconButton
              aria-label="Camisa anterior"
              icon={<ChevronLeft className="size-5" />}
              variant="secondary"
              className="pointer-events-auto"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                prev();
              }}
            />
            <IconButton
              aria-label="Proxima camisa"
              icon={<ChevronRight className="size-5" />}
              variant="secondary"
              className="pointer-events-auto"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                next();
              }}
            />
          </div>
          <div className="absolute inset-x-0 bottom-2 flex justify-center gap-2">
            {produtos.map((produto, dotIndex) => (
              <button
                key={produto.id}
                type="button"
                className={`h-1.5 rounded-full transition-all ${
                  dotIndex === index ? 'w-6 bg-accent' : 'w-1.5 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Ir para ${produto.nome}`}
                aria-current={dotIndex === index}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  goTo(dotIndex);
                }}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
