package br.com.ecommerce_api.application.dtos;

import jakarta.validation.constraints.NotBlank;

public record UsuarioAtualizacaoDTO(
        @NotBlank(message = "O nome não pode estar em branco")
        String nome,

        @NotBlank(message = "O telefone não pode estar em branco")
        String telefone
) {
}