import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type AuthUser = {
  id: number;
  email: string;
  role: 'ROLE_ADMIN' | 'ROLE_USER' | string;
};

type AuthState = {
  token?: string;
  user?: AuthUser;
  setToken: (token: string) => void;
  logout: () => void;
};

export function isAdminUser(user?: Pick<AuthUser, 'email' | 'role'>): boolean {
  if (!user) return false;
  return user.role === 'ROLE_ADMIN';
}

export const selectIsAdmin = (state: AuthState) => isAdminUser(state.user);

function parseJwt(token: string): AuthUser | undefined {
  try {
    const [, payload] = token.split('.');
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=');
    const data = JSON.parse(window.atob(padded)) as { id?: number; sub?: string; role?: string };
    if (!data.id || !data.sub || !data.role) return undefined;

    return {
      id: data.id,
      email: data.sub,
      role: data.role,
    };
  } catch {
    return undefined;
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: undefined,
      user: undefined,
      setToken: (token) => set({ token, user: parseJwt(token) }),
      logout: () => set({ token: undefined, user: undefined }),
    }),
    {
      name: 'creator-commerce-auth',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
