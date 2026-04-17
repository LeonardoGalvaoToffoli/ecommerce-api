package br.com.ecommerce_api.application.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import java.math.BigDecimal;

public record ProdutoRequestDTO(
        @NotBlank String nome,
        @NotBlank String descricao,
        @NotNull @Positive BigDecimal precoBase,
        @NotBlank String tamanho,
        @NotBlank String cor,
        @NotNull @PositiveOrZero Integer estoqueInicial
) {
}