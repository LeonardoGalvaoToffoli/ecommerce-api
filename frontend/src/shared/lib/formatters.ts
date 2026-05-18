export function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatOrderStatus(status: string) {
  const normalized = status.toUpperCase();
  const labels: Record<string, string> = {
    PENDENTE: 'Pendente',
    AGUARDANDO_PAGAMENTO: 'Aguardando pagamento',
    PAGO: 'Pago',
    ENVIADO: 'Enviado',
    CONCLUIDO: 'Concluido',
    CANCELADO: 'Cancelado',
  };

  return labels[normalized] ?? status;
}

export function getInitials(name?: string) {
  if (!name) return 'CC';
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}
