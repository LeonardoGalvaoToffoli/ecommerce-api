import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type CartItem = {
  produtoId: number;
  variacaoId?: number;
  nome: string;
  variacaoLabel?: string;
  precoUnit: number;
  quantidade: number;
  imagemUrl?: string;
};

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: CartItem) => void;
  updateQuantity: (produtoId: number, variacaoId: number | undefined, quantidade: number) => void;
  removeItem: (produtoId: number, variacaoId?: number) => void;
  clearCart: () => void;
};

function sameItem(item: CartItem, produtoId: number, variacaoId?: number) {
  return item.produtoId === produtoId && item.variacaoId === variacaoId;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      addItem: (item) =>
        set((state) => {
          const current = state.items.find((entry) => sameItem(entry, item.produtoId, item.variacaoId));
          if (!current) {
            return { items: [...state.items, item], isOpen: true };
          }

          return {
            items: state.items.map((entry) =>
              sameItem(entry, item.produtoId, item.variacaoId)
                ? { ...entry, quantidade: entry.quantidade + item.quantidade }
                : entry,
            ),
            isOpen: true,
          };
        }),
      updateQuantity: (produtoId, variacaoId, quantidade) =>
        set((state) => ({
          items:
            quantidade <= 0
              ? state.items.filter((entry) => !sameItem(entry, produtoId, variacaoId))
              : state.items.map((entry) =>
                  sameItem(entry, produtoId, variacaoId) ? { ...entry, quantidade } : entry,
                ),
        })),
      removeItem: (produtoId, variacaoId) =>
        set((state) => ({
          items: state.items.filter((entry) => !sameItem(entry, produtoId, variacaoId)),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'creator-commerce-cart',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export function selectCartTotal(items: CartItem[]) {
  return items.reduce((total, item) => total + item.precoUnit * item.quantidade, 0);
}

export function selectCartCount(items: CartItem[]) {
  return items.reduce((total, item) => total + item.quantidade, 0);
}
