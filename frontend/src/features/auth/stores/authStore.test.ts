import { describe, expect, it } from 'vitest';

import { isAdminUser } from './authStore';

describe('isAdminUser', () => {
  it('retorna false quando nao tem usuario', () => {
    expect(isAdminUser(undefined)).toBe(false);
  });

  it('retorna false quando role nao e ROLE_ADMIN', () => {
    expect(
      isAdminUser({ email: 'qualquer@exemplo.com', role: 'ROLE_USER' }),
    ).toBe(false);
  });

  it('retorna true para qualquer email com role ROLE_ADMIN', () => {
    expect(
      isAdminUser({ email: 'um@exemplo.com', role: 'ROLE_ADMIN' }),
    ).toBe(true);
    expect(
      isAdminUser({ email: 'outro@exemplo.com', role: 'ROLE_ADMIN' }),
    ).toBe(true);
  });
});
