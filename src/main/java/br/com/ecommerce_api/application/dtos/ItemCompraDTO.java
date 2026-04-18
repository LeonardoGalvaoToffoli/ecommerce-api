package br.com.ecommerce_api.application.dtos;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record ItemCompraDTO(
        @NotNull Long variacaoId,
        @NotNull @Positive Integer quantidade
) {
}