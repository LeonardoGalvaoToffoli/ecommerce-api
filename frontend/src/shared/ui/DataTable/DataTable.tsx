import { ArrowDownUp } from 'lucide-react';
import { type ReactNode } from 'react';

import { Button } from '@/shared/ui/Button';
import { EmptyState } from '@/shared/ui/EmptyState';
import { Pagination } from '@/shared/ui/Pagination';
import { Skeleton } from '@/shared/ui/Skeleton';

export interface Column<T> {
  key: keyof T | string;
  header: ReactNode;
  render?: (row: T) => ReactNode;
  sortable?: boolean;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  page: number;
  pageSize: number;
  totalElements: number;
  onPageChange: (page: number) => void;
  sort?: { key: string; direction: 'asc' | 'desc' };
  onSortChange?: (sort: { key: string; direction: 'asc' | 'desc' }) => void;
  onRowClick?: (row: T) => void;
  emptyState?: ReactNode;
  rowKey: (row: T) => string | number;
}

export function DataTable<T>({
  columns,
  data,
  emptyState,
  isLoading,
  onPageChange,
  onRowClick,
  onSortChange,
  page,
  pageSize,
  rowKey,
  sort,
  totalElements,
}: DataTableProps<T>) {
  if (!isLoading && !data.length) {
    return (
      <>
        {emptyState ?? <EmptyState title="Nada por aqui ainda" description="Quando houver dados, eles aparecem nesta tabela." />}
      </>
    );
  }

  return (
    <div className="space-y-4">
      <div className="hidden overflow-hidden rounded-lg border border-border md:block">
        <table className="w-full border-collapse text-sm">
          <thead className="sticky top-0 bg-bg-overlay text-left text-fg-secondary">
            <tr>
              {columns.map((column) => (
                <th key={String(column.key)} className="p-4 font-semibold" style={{ width: column.width }}>
                  {column.sortable ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      rightIcon={<ArrowDownUp className="size-3" />}
                      onClick={() =>
                        onSortChange?.({
                          key: String(column.key),
                          direction:
                            sort?.key === column.key && sort.direction === 'asc' ? 'desc' : 'asc',
                        })
                      }
                    >
                      {column.header}
                    </Button>
                  ) : (
                    column.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading
              ? Array.from({ length: pageSize }).map((_, index) => (
                  <tr key={index}>
                    {columns.map((column) => (
                      <td key={String(column.key)} className="p-4">
                        <Skeleton variant="text" width="80%" />
                      </td>
                    ))}
                  </tr>
                ))
              : data.map((row) => (
                  <tr
                    key={rowKey(row)}
                    className={onRowClick ? 'cursor-pointer transition hover:bg-bg-elevated' : undefined}
                    onClick={() => onRowClick?.(row)}
                  >
                    {columns.map((column) => (
                      <td key={String(column.key)} className="p-4 text-fg-primary">
                        {column.render ? column.render(row) : String(row[column.key as keyof T] ?? '')}
                      </td>
                    ))}
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {isLoading
          ? Array.from({ length: Math.min(pageSize, 4) }).map((_, index) => (
              <Skeleton key={index} className="h-32 w-full rounded-lg" />
            ))
          : data.map((row) => (
              <button
                key={rowKey(row)}
                type="button"
                className="w-full rounded-lg border border-border bg-bg-elevated p-4 text-left"
                onClick={() => onRowClick?.(row)}
              >
                {columns.slice(0, 3).map((column) => (
                  <p key={String(column.key)} className="mb-2 text-sm">
                    <span className="text-fg-muted">{column.header}: </span>
                    <span className="text-fg-primary">
                      {column.render ? column.render(row) : String(row[column.key as keyof T] ?? '')}
                    </span>
                  </p>
                ))}
              </button>
            ))}
      </div>

      <Pagination page={page} pageSize={pageSize} totalElements={totalElements} onPageChange={onPageChange} />
    </div>
  );
}
