import { describe, expect, it } from 'vitest';

import { ADMIN_EMAIL, isAdminUser } from './authStore';

describe('isAdminUser', () => {
  it('retorna false quando nao tem usuario', () => {
    expect(isAdminUser(undefined)).toBe(false);
  });

  it('retorna false quando role nao e ROLE_ADMIN, mesmo com email certo', () => {
    expect(
      isAdminUser({ email: ADMIN_EMAIL, role: 'ROLE_USER' }),
    ).toBe(false);
  });

  it('retorna false quando tem role admin mas email errado', () => {
    expect(
      isAdminUser({ email: 'outro@exemplo.com', role: 'ROLE_ADMIN' }),
    ).toBe(false);
  });

  it('retorna true quando role e email batem', () => {
    expect(
      isAdminUser({ email: ADMIN_EMAIL, role: 'ROLE_ADMIN' }),
    ).toBe(true);
  });

  it('ignora caixa alta/baixa no email', () => {
    expect(
      isAdminUser({ email: ADMIN_EMAIL.toUpperCase(), role: 'ROLE_ADMIN' }),
    ).toBe(true);
  });
});
