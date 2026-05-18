import { CheckCircle2 } from 'lucide-react';
import { useParams } from 'react-router-dom';

import { EmptyState } from '@/shared/ui/EmptyState';

export function OrderSuccessPage() {
  const { id } = useParams();

  return (
    <section className="container-app py-12">
      <EmptyState
        icon={<CheckCircle2 className="size-12" />}
        title="Pedido confirmado"
        description={id ? `Pedido #${id} registrado. A gente vai despachar suas camisas assim que o PIX cair. Acompanhe em Minha conta.` : 'Acompanhe o status do seu pedido em Minha conta.'}
        action={{ label: 'Ver meus pedidos', href: '/minha-conta' }}
      />
    </section>
  );
}
