package br.com.ecommerce_api.application.dtos;

import jakarta.validation.constraints.NotBlank;

public record EnderecoRequestDTO(
        @NotBlank String cep,
        @NotBlank String rua,
        @NotBlank String numero,
        String complemento,
        @NotBlank String bairro,
        @NotBlank String cidade,
        @NotBlank String estado
) {
}