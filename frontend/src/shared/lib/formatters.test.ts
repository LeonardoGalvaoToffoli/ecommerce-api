import { describe, expect, it } from 'vitest';

import { formatCurrency, formatOrderStatus, getInitials } from './formatters';

describe('formatters', () => {
  describe('formatCurrency', () => {
    // Intl usa NBSP entre simbolo e valor em pt-BR; normalizamos pra space comum
    const normalize = (value: string) => value.replace(/\s/g, ' ');

    it('formata em BRL com simbolo R$', () => {
      expect(normalize(formatCurrency(89.9))).toBe('R$ 89,90');
      expect(normalize(formatCurrency(0))).toBe('R$ 0,00');
      expect(normalize(formatCurrency(1234.5))).toBe('R$ 1.234,50');
    });
  });

  describe('formatOrderStatus', () => {
    it('traduz status conhecidos', () => {
      expect(formatOrderStatus('PAGO')).toBe('Pago');
      expect(formatOrderStatus('aguardando_pagamento')).toBe('Aguardando pagamento');
    });

    it('devolve o input quando o status nao mapeia', () => {
      expect(formatOrderStatus('STATUS_QUALQUER')).toBe('STATUS_QUALQUER');
    });
  });

  describe('getInitials', () => {
    it('devolve duas iniciais', () => {
      expect(getInitials('Joao Paulo')).toBe('JP');
      expect(getInitials('Maria Clara Souza')).toBe('MC');
    });

    it('lida com nome unico', () => {
      expect(getInitials('Joao')).toBe('J');
    });

    it('fallback CC quando nome esta vazio', () => {
      expect(getInitials()).toBe('CC');
      expect(getInitials('')).toBe('CC');
    });
  });
});
