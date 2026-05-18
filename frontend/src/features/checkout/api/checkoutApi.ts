import { http } from '@/shared/api/http';
import type {
  CheckoutRequestDTO,
  CheckoutResponseDTO,
  EnderecoRequestDTO,
  EnderecoResponseDTO,
  PedidoDetalheDTO,
  PedidoHistoricoDTO,
} from '@/shared/api/types';

export async function checkout(payload: CheckoutRequestDTO) {
  const { data } = await http.post<CheckoutResponseDTO>('/pedidos/checkout', payload);
  return data;
}

export async function fetchPedido(id: number | string) {
  const { data } = await http.get<PedidoDetalheDTO>(`/pedidos/${id}`);
  return data;
}

export async function fetchMeusPedidos() {
  const { data } = await http.get<PedidoHistoricoDTO[]>('/pedidos/meus-pedidos');
  return data;
}

export async function fetchEnderecos() {
  const { data } = await http.get<EnderecoResponseDTO[]>('/enderecos');
  return data;
}

export async function addEndereco(payload: EnderecoRequestDTO) {
  const { data } = await http.post<EnderecoResponseDTO>('/enderecos', payload);
  return data;
}
