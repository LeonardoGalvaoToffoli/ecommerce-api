import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { ArrowRight, CheckCircle2, MapPin, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { checkout as checkoutOrder } from '@/features/checkout/api/checkoutApi';
import { PixPanel } from '@/features/checkout/components/PixPanel';
import { useAuthStore } from '@/features/auth/stores/authStore';
import {
  selectCartTotal,
  useCartStore,
} from '@/features/cart/stores/cartStore';
import type { CheckoutResponseDTO } from '@/shared/api/types';
import { formatCurrency } from '@/shared/lib/formatters';
import { Button } from '@/shared/ui/Button';
import { EmptyState } from '@/shared/ui/EmptyState';
import { Field } from '@/shared/ui/Field';
import { Input } from '@/shared/ui/Input';
import { useToast } from '@/shared/ui/Toast';

const addressSchema = z.object({
  cep: z.string().min(8, 'Informe o CEP'),
  rua: z.string().min(1, 'Informe a rua'),
  numero: z.string().min(1, 'Informe o numero'),
  complemento: z.string().optional(),
  bairro: z.string().min(1, 'Informe o bairro'),
  cidade: z.string().min(1, 'Informe a cidade'),
  estado: z.string().min(2, 'Informe o estado'),
});

type AddressValues = z.infer<typeof addressSchema>;
type Step = 'review' | 'address' | 'payment' | 'confirmation';

export function CheckoutPage() {
  const { user } = useAuthStore();
  const { clearCart, items } = useCartStore();
  const { toast } = useToast();
  const [step, setStep] = useState<Step>('review');
  const [checkout, setCheckout] = useState<CheckoutResponseDTO | undefined>();
  const total = selectCartTotal(items);
  const invalidItems = items.filter((item) => !item.variacaoId);

  const form = useForm<AddressValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      cep: '',
      rua: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
    },
  });

  const mutation = useMutation({
    mutationFn: checkoutOrder,
    onSuccess: (response) => {
      setCheckout(response);
      clearCart();
      setStep('payment');
      toast.success('Pedido criado', {
        description: 'Falta so pagar o PIX para a gente despachar sua camisa.',
      });
    },
    onError: () => {
      toast.error('Nao foi possivel criar o pedido', {
        description: 'Confira o endereco, o estoque das camisas e tente novamente.',
      });
    },
  });

  if (!user) {
    return (
      <section className="container-app py-12">
        <EmptyState
          title="Entre para continuar"
          description="Voce pode olhar a vitrine sem login, mas o checkout precisa de uma conta."
          action={{ label: 'Entrar agora', href: '/entrar' }}
        />
      </section>
    );
  }

  if (!items.length && !checkout && step !== 'confirmation') {
    return (
      <section className="container-app py-12">
        <EmptyState
          icon={<ShoppingBag className="size-10" />}
          title="Seu carrinho esta vazio"
          description="Adicione uma camisa antes de iniciar o checkout."
          action={{ label: 'Ver camisas', href: '/produtos' }}
        />
      </section>
    );
  }

  return (
    <section className="container-app py-12">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">Checkout</p>
        <h1 className="mt-2 font-display text-5xl font-bold tracking-tight">Finalize seu pedido com PIX</h1>
      </div>

      <ol className="mb-8 grid gap-3 text-sm md:grid-cols-4">
        {[
          ['review', 'Revisao'],
          ['address', 'Endereco'],
          ['payment', 'PIX'],
          ['confirmation', 'Confirmacao'],
        ].map(([key, label], index) => (
          <li
            key={key}
            className={`rounded-full border px-4 py-2 ${
              step === key ? 'border-accent bg-accent text-accent-fg' : 'border-border bg-bg-elevated text-fg-secondary'
            }`}
          >
            {index + 1}. {label}
          </li>
        ))}
      </ol>

      {step === 'review' ? (
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="rounded-lg border border-border bg-bg-elevated p-6">
            <h2 className="font-display text-2xl font-semibold">Camisas do pedido</h2>
            <div className="mt-5 divide-y divide-border">
              {items.map((item) => (
                <div key={`${item.produtoId}-${item.variacaoId ?? 'base'}`} className="flex justify-between gap-4 py-4">
                  <div>
                    <p className="font-semibold">{item.nome}</p>
                    <p className="text-sm text-fg-secondary">
                      {item.variacaoLabel ?? 'Escolha tamanho e cor no detalhe'} · {item.quantidade} un.
                    </p>
                  </div>
                  <p className="font-semibold">{formatCurrency(item.precoUnit * item.quantidade)}</p>
                </div>
              ))}
            </div>
            {invalidItems.length ? (
              <p className="mt-4 rounded-md border border-warning/30 bg-warning/10 p-3 text-sm text-warning">
                Existem camisas antigas sem tamanho/cor selecionados. Remova e adicione pelo detalhe do produto antes de continuar.
              </p>
            ) : null}
          </div>
          <aside className="h-fit rounded-lg border border-border bg-bg-elevated p-6">
            <p className="text-fg-secondary">Total</p>
            <p className="mt-2 font-display text-4xl font-bold text-accent">{formatCurrency(total)}</p>
            <Button
              className="mt-6"
              fullWidth
              disabled={Boolean(invalidItems.length)}
              rightIcon={<ArrowRight className="size-4" />}
              onClick={() => setStep('address')}
            >
              Continuar
            </Button>
          </aside>
        </div>
      ) : null}

      {step === 'address' ? (
        <form
          className="max-w-3xl rounded-lg border border-border bg-bg-elevated p-6"
          onSubmit={form.handleSubmit((values) =>
            mutation.mutate({
              usuarioId: user.id,
              endereco: values,
              itens: items
                .filter((item) => item.variacaoId)
                .map((item) => ({ variacaoId: item.variacaoId!, quantidade: item.quantidade })),
            }),
          )}
        >
          <h2 className="mb-5 flex items-center gap-2 font-display text-2xl font-semibold">
            <MapPin className="size-5 text-accent" /> Endereco de entrega
          </h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="CEP" htmlFor="cep" error={form.formState.errors.cep?.message} required>
              <Input id="cep" {...form.register('cep')} />
            </Field>
            <Field label="Rua" htmlFor="rua" error={form.formState.errors.rua?.message} required>
              <Input id="rua" {...form.register('rua')} />
            </Field>
            <Field label="Numero" htmlFor="numero" error={form.formState.errors.numero?.message} required>
              <Input id="numero" {...form.register('numero')} />
            </Field>
            <Field label="Complemento" htmlFor="complemento" error={form.formState.errors.complemento?.message}>
              <Input id="complemento" {...form.register('complemento')} />
            </Field>
            <Field label="Bairro" htmlFor="bairro" error={form.formState.errors.bairro?.message} required>
              <Input id="bairro" {...form.register('bairro')} />
            </Field>
            <Field label="Cidade" htmlFor="cidade" error={form.formState.errors.cidade?.message} required>
              <Input id="cidade" {...form.register('cidade')} />
            </Field>
            <Field label="Estado" htmlFor="estado" error={form.formState.errors.estado?.message} required>
              <Input id="estado" {...form.register('estado')} />
            </Field>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button type="button" variant="secondary" onClick={() => setStep('review')}>
              Voltar
            </Button>
            <Button type="submit" isLoading={mutation.isPending}>
              Criar pedido PIX
            </Button>
          </div>
        </form>
      ) : null}

      {step === 'payment' && checkout ? (
        <PixPanel checkout={checkout} onConfirmado={() => setStep('confirmation')} />
      ) : null}

      {step === 'confirmation' ? (
        <EmptyState
          icon={<CheckCircle2 className="size-12" />}
          title="Pagamento confirmado"
          description="Recebemos seu PIX. Agora e so esperar a camisa chegar. Voce pode acompanhar pelo Minha conta."
          action={{ label: 'Ver meus pedidos', href: '/minha-conta' }}
        />
      ) : null}
    </section>
  );
}
