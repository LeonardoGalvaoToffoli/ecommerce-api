package br.com.ecommerce_api.application.dtos;

import java.math.BigDecimal;

public record PedidoHistoricoDTO(
        Long pedidoId,
        BigDecimal valorTotal,
        String statusPedido
) {
}