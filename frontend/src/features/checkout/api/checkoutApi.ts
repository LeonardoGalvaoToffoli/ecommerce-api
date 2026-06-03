import { http } from '@/shared/api/http';
import type {
  CheckoutRequestDTO,
  CheckoutResponseDTO,
  EnderecoRequestDTO,
  EnderecoResponseDTO,
  Page,
  PedidoAdminDTO,
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

export async function fetchPedidosAdmin(params: { page?: number; size?: number; sort?: string } = {}) {
  const { data } = await http.get<Page<PedidoAdminDTO>>('/pedidos/admin', { params });
  return data;
}

export async function simularPixPagoAdmin(pedidoId: number) {
  const { data } = await http.post<PedidoAdminDTO>(`/pedidos/${pedidoId}/simular-pix-pago`);
  return data;
}
