package br.com.ecommerce_api.application.dtos;

import java.math.BigDecimal;
import java.util.List;

public record PedidoDetalheDTO(
        Long pedidoId,
        String statusPedido,
        BigDecimal valorTotal,
        String enderecoEntrega,
        List<ItemPedidoDTO> itens
) {
}