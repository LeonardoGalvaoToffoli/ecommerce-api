import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/shared/ui/Button';

export interface PaginationProps {
  page: number;
  pageSize: number;
  totalElements: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
}

function createPages(page: number, totalPages: number, siblingCount: number) {
  const pages = new Set<number>([0, totalPages - 1, page]);
  for (let offset = 1; offset <= siblingCount; offset += 1) {
    pages.add(page - offset);
    pages.add(page + offset);
  }

  return [...pages].filter((item) => item >= 0 && item < totalPages).sort((a, b) => a - b);
}

export function Pagination({ onPageChange, page, pageSize, siblingCount = 1, totalElements }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalElements / pageSize));
  const pages = createPages(page, totalPages, siblingCount);

  return (
    <nav className="flex flex-wrap items-center justify-center gap-2" aria-label="Paginacao">
      <Button
        variant="secondary"
        size="sm"
        disabled={page <= 0}
        leftIcon={<ChevronLeft className="size-4" />}
        onClick={() => onPageChange(page - 1)}
      >
        Anterior
      </Button>
      {pages.map((item, index) => {
        const previous = pages[index - 1];
        return (
          <span key={item} className="inline-flex items-center gap-2">
            {previous !== undefined && item - previous > 1 ? <span className="text-fg-muted">...</span> : null}
            <Button
              variant={item === page ? 'primary' : 'ghost'}
              size="sm"
              aria-current={item === page ? 'page' : undefined}
              onClick={() => onPageChange(item)}
            >
              {item + 1}
            </Button>
          </span>
        );
      })}
      <Button
        variant="secondary"
        size="sm"
        disabled={page >= totalPages - 1}
        rightIcon={<ChevronRight className="size-4" />}
        onClick={() => onPageChange(page + 1)}
      >
        Proxima
      </Button>
    </nav>
  );
}
