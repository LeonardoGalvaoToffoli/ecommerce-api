import { useMutation } from '@tanstack/react-query';

import { fetchProduto } from '@/features/catalog/api/produtosApi';
import { useCartStore } from '@/features/cart/stores/cartStore';
import { useToast } from '@/shared/ui/Toast';

export function useAddProductToCart() {
  const addItem = useCartStore((state) => state.addItem);
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (produtoId: number) => {
      const produto = await fetchProduto(produtoId);
      const variacao = produto.variacoes.find((item) => item.quantidadeEstoque > 0);
      if (!variacao) {
        throw new Error('Produto sem estoque');
      }

      addItem({
        produtoId: produto.id,
        variacaoId: variacao.id,
        nome: produto.nome,
        variacaoLabel: `${variacao.tamanho} · ${variacao.cor}`,
        precoUnit: produto.precoBase,
        quantidade: 1,
        imagemUrl: produto.imagemUrl ?? undefined,
      });

      return produto;
    },
    onSuccess: (produto) => {
      toast.success('Camisa adicionada ao carrinho', {
        description: `${produto.nome} ja esta esperando por voce.`,
      });
    },
    onError: () => {
      toast.error('Nao foi possivel adicionar', {
        description: 'Abra o detalhe da camisa e confira tamanhos e cores disponiveis.',
      });
    },
  });
}
