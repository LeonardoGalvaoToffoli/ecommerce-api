package br.com.ecommerce_api.application.dtos;

import java.math.BigDecimal;

public record CheckoutResponseDTO(
        Long pedidoId,
        BigDecimal valorTotal,
        String statusPedido,
        String codigoPixCopiaECola
) {
}