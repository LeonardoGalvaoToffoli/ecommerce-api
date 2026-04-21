package br.com.ecommerce_api.application.dtos;

import java.math.BigDecimal;

public record ItemPedidoDTO(
        Long produtoId,
        String nomeProduto,
        String tamanho,
        String cor,
        Integer quantidade,
        BigDecimal precoUnitario
) {
}