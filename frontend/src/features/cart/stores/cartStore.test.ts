import { beforeEach, describe, expect, it } from 'vitest';

import { selectCartCount, selectCartTotal, useCartStore } from './cartStore';

const sampleItem = {
  produtoId: 1,
  variacaoId: 10,
  nome: 'Camisa Preta',
  variacaoLabel: 'M · Preto',
  precoUnit: 89.9,
  quantidade: 1,
};

describe('cartStore', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [], isOpen: false });
  });

  it('adiciona item e abre o drawer', () => {
    useCartStore.getState().addItem(sampleItem);
    const state = useCartStore.getState();

    expect(state.items).toHaveLength(1);
    expect(state.isOpen).toBe(true);
  });

  it('soma quantidade ao adicionar a mesma variacao duas vezes', () => {
    useCartStore.getState().addItem({ ...sampleItem, quantidade: 1 });
    useCartStore.getState().addItem({ ...sampleItem, quantidade: 2 });

    const state = useCartStore.getState();
    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantidade).toBe(3);
  });

  it('mantem itens separados quando variacoes diferem', () => {
    useCartStore.getState().addItem(sampleItem);
    useCartStore.getState().addItem({ ...sampleItem, variacaoId: 11, variacaoLabel: 'G · Preto' });

    expect(useCartStore.getState().items).toHaveLength(2);
  });

  it('updateQuantity remove o item quando quantidade <= 0', () => {
    useCartStore.getState().addItem(sampleItem);
    useCartStore.getState().updateQuantity(1, 10, 0);

    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('removeItem tira so a variacao especificada', () => {
    useCartStore.getState().addItem(sampleItem);
    useCartStore.getState().addItem({ ...sampleItem, variacaoId: 11 });
    useCartStore.getState().removeItem(1, 10);

    const remaining = useCartStore.getState().items;
    expect(remaining).toHaveLength(1);
    expect(remaining[0].variacaoId).toBe(11);
  });

  it('clearCart zera os itens', () => {
    useCartStore.getState().addItem(sampleItem);
    useCartStore.getState().clearCart();

    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('selectCartTotal multiplica preco por quantidade', () => {
    const total = selectCartTotal([
      { ...sampleItem, quantidade: 2 },
      { ...sampleItem, variacaoId: 11, precoUnit: 50, quantidade: 1 },
    ]);
    expect(total).toBeCloseTo(89.9 * 2 + 50, 2);
  });

  it('selectCartCount soma quantidades', () => {
    const count = selectCartCount([
      { ...sampleItem, quantidade: 2 },
      { ...sampleItem, variacaoId: 11, quantidade: 3 },
    ]);
    expect(count).toBe(5);
  });
});
