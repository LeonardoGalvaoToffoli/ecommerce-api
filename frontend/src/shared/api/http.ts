import axios, { AxiosError } from 'axios';

import { useAuthStore } from '@/features/auth/stores/authStore';
import type { ErroResposta } from '@/shared/api/types';

export type ApiError = ErroResposta & {
  status?: number;
};

function normalizeApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<Partial<ErroResposta> | string>;
    const status = axiosError.response?.status;
    const payload = axiosError.response?.data;

    if (typeof payload === 'object' && payload?.mensagem) {
      return { status, mensagem: payload.mensagem, campos: payload.campos };
    }

    return {
      status,
      mensagem:
        status === 401
          ? 'Sua sessao expirou. Entre novamente para continuar.'
          : 'Nao conseguimos processar agora. Tente novamente em alguns segundos.',
    };
  }

  return { mensagem: 'Algo saiu do trilho. Tente novamente em alguns segundos.' };
}

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

http.interceptors.request.use((config) => {
  const { token } = useAuthStore.getState();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      useAuthStore.getState().logout();
    }

    return Promise.reject(normalizeApiError(error));
  },
);
