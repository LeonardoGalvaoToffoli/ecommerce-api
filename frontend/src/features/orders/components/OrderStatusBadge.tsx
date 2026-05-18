import { Badge, type BadgeProps } from '@/shared/ui/Badge';
import { formatOrderStatus } from '@/shared/lib/formatters';

const statusVariant: Record<string, BadgeProps['variant']> = {
  PENDENTE: 'warning',
  AGUARDANDO_PAGAMENTO: 'warning',
  PAGO: 'info',
  ENVIADO: 'accent',
  CONCLUIDO: 'success',
  CANCELADO: 'danger',
};

export function OrderStatusBadge({ status }: { status: string }) {
  const normalized = status.toUpperCase();
  return (
    <Badge dot variant={statusVariant[normalized] ?? 'neutral'}>
      {formatOrderStatus(status)}
    </Badge>
  );
}
