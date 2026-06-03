package br.com.ecommerce_api.application.dtos;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PedidoAdminDTO(
        Long pedidoId,
        LocalDateTime dataPedido,
        String statusPedido,
        BigDecimal valorTotal,
        String clienteNome,
        String clienteEmail,
        String codigoPix,
        String statusPagamento
) {
}
