package br.com.ecommerce_api.application.dtos;

import jakarta.validation.constraints.NotBlank;

public record EnderecoRequestDTO(
        @NotBlank(message = "CEP é obrigatório") String cep,
        @NotBlank(message = "Rua é obrigatória") String rua,
        @NotBlank(message = "Número é obrigatório") String numero,
        String complemento,
        @NotBlank(message = "Bairro é obrigatório") String bairro,
        @NotBlank(message = "Cidade é obrigatória") String cidade,
        @NotBlank(message = "Estado é obrigatório") String estado
) {
}