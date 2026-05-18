import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { registerAdmin, registerUser } from '@/features/auth/api/authApi';
import { isAdminUser, useAuthStore } from '@/features/auth/stores/authStore';
import { Button } from '@/shared/ui/Button';
import { Field } from '@/shared/ui/Field';
import { Input } from '@/shared/ui/Input';
import { useToast } from '@/shared/ui/Toast';

const schema = z.object({
  nome: z.string().min(2, 'Informe seu nome'),
  email: z.string().email('Informe um e-mail valido'),
  senha: z.string().min(6, 'Use pelo menos 6 caracteres'),
  cpf: z.string().min(11, 'Informe seu CPF'),
  telefone: z.string().min(8, 'Informe seu telefone'),
});

type RegisterValues = z.infer<typeof schema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuthStore();
  const isAdmin = isAdminUser(user);
  const [createAsAdmin, setCreateAsAdmin] = useState(false);

  const form = useForm<RegisterValues>({
    resolver: zodResolver(schema),
    defaultValues: { nome: '', email: '', senha: '', cpf: '', telefone: '' },
  });

  const mutation = useMutation({
    mutationFn: (values: RegisterValues) =>
      isAdmin && createAsAdmin ? registerAdmin(values) : registerUser(values),
    onSuccess: () => {
      if (isAdmin && createAsAdmin) {
        toast.success('Novo administrador criado', {
          description: 'A nova conta admin ja pode entrar com o e-mail e senha cadastrados.',
        });
        form.reset();
        setCreateAsAdmin(false);
        navigate('/admin/usuarios');
        return;
      }
      toast.success('Conta criada com sucesso', {
        description: 'Agora entre com e-mail e senha para continuar.',
      });
      navigate('/entrar');
    },
    onError: () => {
      toast.error('Nao foi possivel criar a conta', {
        description: 'Confira os dados e tente novamente.',
      });
    },
  });

  return (
    <section className="container-app grid min-h-[calc(100dvh-160px)] items-center gap-10 py-12 lg:grid-cols-2">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">
          {isAdmin ? 'Cadastro admin' : 'Cadastro'}
        </p>
        <h1 className="mt-3 font-display text-5xl font-bold tracking-tight">
          {isAdmin && createAsAdmin
            ? 'Cadastre um novo administrador.'
            : 'Crie sua conta para comprar suas camisas.'}
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-8 text-fg-secondary">
          {isAdmin
            ? 'Voce esta logado como administrador. Use a opcao abaixo para criar uma conta admin ou um cliente comum.'
            : 'Cadastro rapido em poucos campos. Depois e so escolher seu modelo, tamanho e finalizar com PIX.'}
        </p>
      </div>
      <form
        className="rounded-lg border border-border bg-bg-elevated p-6 shadow-md"
        onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
      >
        {isAdmin ? (
          <label className="mb-5 flex items-start gap-3 rounded-md border border-border bg-bg-overlay p-4 text-sm">
            <input
              type="checkbox"
              className="mt-1 size-4 accent-accent"
              checked={createAsAdmin}
              onChange={(event) => setCreateAsAdmin(event.target.checked)}
            />
            <span className="flex-1">
              <span className="flex items-center gap-2 font-semibold text-fg-primary">
                <ShieldCheck className="size-4 text-accent" /> Criar como administrador
              </span>
              <span className="mt-1 block text-fg-secondary">
                A nova conta tera acesso completo ao painel admin.
              </span>
            </span>
          </label>
        ) : null}
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Nome" htmlFor="nome" error={form.formState.errors.nome?.message} required>
            <Input id="nome" autoComplete="name" {...form.register('nome')} />
          </Field>
          <Field label="E-mail" htmlFor="email" error={form.formState.errors.email?.message} required>
            <Input id="email" type="email" autoComplete="email" {...form.register('email')} />
          </Field>
          <Field label="CPF" htmlFor="cpf" error={form.formState.errors.cpf?.message} required>
            <Input id="cpf" {...form.register('cpf')} />
          </Field>
          <Field label="Telefone" htmlFor="telefone" error={form.formState.errors.telefone?.message} required>
            <Input id="telefone" autoComplete="tel" {...form.register('telefone')} />
          </Field>
          <Field label="Senha" htmlFor="senha" error={form.formState.errors.senha?.message} required>
            <Input id="senha" type="password" autoComplete="new-password" {...form.register('senha')} />
          </Field>
        </div>
        <Button type="submit" className="mt-6" fullWidth isLoading={mutation.isPending}>
          {isAdmin && createAsAdmin ? 'Cadastrar administrador' : 'Criar conta'}
        </Button>
        {isAdmin ? null : (
          <p className="mt-5 text-center text-sm text-fg-secondary">
            Ja tem conta?{' '}
            <Link to="/entrar" className="font-semibold text-accent">
              Entrar
            </Link>
          </p>
        )}
      </form>
    </section>
  );
}
