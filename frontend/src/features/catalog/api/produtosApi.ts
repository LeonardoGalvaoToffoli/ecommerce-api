import { http } from '@/shared/api/http';
import type {
  Page,
  ProdutoAtualizacaoDTO,
  ProdutoDetalheDTO,
  ProdutoRequestDTO,
  ProdutoResponseDTO,
} from '@/shared/api/types';

export type ProdutosParams = {
  page?: number;
  size?: number;
  sort?: string;
};

export async function fetchProdutos(params: ProdutosParams = {}) {
  const { data } = await http.get<Page<ProdutoResponseDTO>>('/produtos', { params });
  return data;
}

export async function fetchDestaques() {
  const { data } = await http.get<ProdutoResponseDTO[]>('/produtos/destaques');
  return data;
}

export async function fetchProduto(id: number | string) {
  const { data } = await http.get<ProdutoDetalheDTO>(`/produtos/${id}`);
  return data;
}

export async function createProduto(payload: ProdutoRequestDTO) {
  const { data } = await http.post<ProdutoResponseDTO>('/produtos', payload);
  return data;
}

export async function updateProduto(id: number, payload: ProdutoAtualizacaoDTO) {
  const { data } = await http.put<ProdutoResponseDTO>(`/produtos/${id}`, payload);
  return data;
}
