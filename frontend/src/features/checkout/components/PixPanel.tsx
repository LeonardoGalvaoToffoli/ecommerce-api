import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, Copy, QrCode } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { fetchPedido } from '@/features/checkout/api/checkoutApi';
import type { CheckoutResponseDTO } from '@/shared/api/types';
import { formatCurrency, formatOrderStatus } from '@/shared/lib/formatters';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { useToast } from '@/shared/ui/Toast';

interface PixPanelProps {
  checkout: CheckoutResponseDTO;
  onConfirmado: () => void;
}

export function PixPanel({ checkout, onConfirmado }: PixPanelProps) {
  const { toast } = useToast();
  const [expiresAt] = useState(() => Date.now() + 30 * 60 * 1000);
  const [now, setNow] = useState(Date.now());
  const [isVisible, setIsVisible] = useState(() => document.visibilityState === 'visible');

  const pedidoQuery = useQuery({
    queryKey: ['pedido', checkout.pedidoId],
    queryFn: () => fetchPedido(checkout.pedidoId),
    enabled: isVisible,
    refetchInterval: (query) => {
      const status = query.state.data?.statusPedido?.toUpperCase();
      return status === 'PAGO' || status === 'CANCELADO' ? false : 5000;
    },
  });

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const onVisibilityChange = () => setIsVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, []);

  useEffect(() => {
    if (pedidoQuery.data?.statusPedido?.toUpperCase() === 'PAGO') {
      onConfirmado();
    }
  }, [onConfirmado, pedidoQuery.data?.statusPedido]);

  const countdown = useMemo(() => {
    const remaining = Math.max(0, expiresAt - now);
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }, [expiresAt, now]);

  const status = pedidoQuery.data?.statusPedido ?? checkout.statusPedido;

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <div className="rounded-lg border border-border bg-bg-elevated p-6 text-center">
        <div className="surface-grid mx-auto grid aspect-square w-full max-w-72 place-items-center rounded-lg border border-border bg-bg-overlay">
          <QrCode className="size-24 text-accent" aria-hidden="true" />
        </div>
        <p className="mt-4 text-sm text-fg-secondary">
          Use o codigo copia e cola ao lado para pagar pelo seu app do banco.
        </p>
      </div>
      <div className="rounded-lg border border-border bg-bg-elevated p-6">
        <Badge dot variant={status.toUpperCase() === 'PAGO' ? 'success' : 'warning'}>
          {formatOrderStatus(status)}
        </Badge>
        <h2 className="mt-4 font-display text-3xl font-semibold">Pagamento PIX</h2>
        <p className="mt-2 text-fg-secondary">
          Pedido #{checkout.pedidoId} no valor de{' '}
          <strong className="text-fg-primary">{formatCurrency(checkout.valorTotal)}</strong>. Confirmamos o pagamento automaticamente assim que o PIX cair.
        </p>
        <div className="mt-5 rounded-md border border-border bg-bg-overlay p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-fg-muted">Copia e cola</p>
          <code className="break-all text-sm text-fg-primary">{checkout.codigoPixCopiaECola}</code>
        </div>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Button
            leftIcon={<Copy className="size-4" />}
            onClick={async () => {
              await navigator.clipboard.writeText(checkout.codigoPixCopiaECola);
              toast.success('Codigo PIX copiado');
            }}
          >
            Copiar codigo PIX
          </Button>
          <Button asChild variant="secondary">
            <Link to="/minha-conta">Ver meus pedidos</Link>
          </Button>
        </div>
        <p className="mt-5 text-sm text-fg-secondary">Expira em aproximadamente {countdown}.</p>
        {pedidoQuery.isError ? (
          <p className="mt-3 rounded-md border border-warning/30 bg-warning/10 p-3 text-sm text-warning">
            Tivemos um problema para verificar o status. Vamos tentar de novo automaticamente.
          </p>
        ) : null}
        {status.toUpperCase() === 'PAGO' ? (
          <p className="mt-4 flex items-center gap-2 text-success">
            <CheckCircle2 className="size-5" /> Pagamento confirmado.
          </p>
        ) : null}
      </div>
    </div>
  );
}
