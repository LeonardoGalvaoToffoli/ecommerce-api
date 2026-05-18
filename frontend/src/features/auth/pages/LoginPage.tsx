import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { login } from '@/features/auth/api/authApi';
import { isAdminUser, useAuthStore } from '@/features/auth/stores/authStore';
import { Button } from '@/shared/ui/Button';
import { Field } from '@/shared/ui/Field';
import { Input } from '@/shared/ui/Input';
import { useToast } from '@/shared/ui/Toast';

const schema = z.object({
  email: z.string().email('Informe um e-mail valido'),
  senha: z.string().min(1, 'Informe sua senha'),
});

type LoginValues = z.infer<typeof schema>;

export function LoginPage() {
  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);
  const { toast } = useToast();
  const form = useForm<LoginValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', senha: '' },
  });

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: ({ token }) => {
      setToken(token);
      const loggedUser = useAuthStore.getState().user;
      toast.success('Voce entrou com sucesso');
      navigate(isAdminUser(loggedUser) ? '/admin' : '/minha-conta');
    },
    onError: () => {
      toast.error('Nao conseguimos entrar', {
        description: 'Confira e-mail e senha e tente novamente.',
      });
    },
  });

  return (
    <section className="container-app grid min-h-[calc(100dvh-160px)] items-center gap-10 py-12 lg:grid-cols-2">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">Bem-vindo</p>
        <h1 className="mt-3 font-display text-5xl font-bold tracking-tight">Entre e leve sua camisa pra casa.</h1>
        <p className="mt-5 max-w-xl text-lg leading-8 text-fg-secondary">
          As camisas que voce salvou no carrinho continuam aqui. Faca login pra finalizar com PIX e acompanhar a entrega.
        </p>
      </div>
      <form
        className="rounded-lg border border-border bg-bg-elevated p-6 shadow-md"
        onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
      >
        <div className="space-y-5">
          <Field label="E-mail" htmlFor="email" error={form.formState.errors.email?.message} required>
            <Input id="email" type="email" autoComplete="email" {...form.register('email')} />
          </Field>
          <Field label="Senha" htmlFor="senha" error={form.formState.errors.senha?.message} required>
            <Input id="senha" type="password" autoComplete="current-password" {...form.register('senha')} />
          </Field>
        </div>
        <Button
          type="submit"
          className="mt-6"
          fullWidth
          isLoading={mutation.isPending}
          rightIcon={<ArrowRight className="size-4" />}
        >
          Entrar
        </Button>
        <p className="mt-5 text-center text-sm text-fg-secondary">
          Ainda nao tem conta?{' '}
          <Link to="/criar-conta" className="font-semibold text-accent">
            Criar agora
          </Link>
        </p>
      </form>
    </section>
  );
}
