package br.com.ecommerce_api.application.dtos;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record CheckoutRequestDTO(
        @NotNull Long usuarioId,
        @Valid @NotNull EnderecoRequestDTO endereco,
        @NotEmpty @Valid List<ItemCompraDTO> itens
) {
}