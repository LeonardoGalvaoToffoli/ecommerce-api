package br.com.ecommerce_api.application.dtos;

import jakarta.validation.constraints.NotBlank;

public record WebhookPixDTO(
        @NotBlank String codigoPix,
        @NotBlank String statusPagamento // Ex: "APROVADO" ou "RECUSADO"
) {
}