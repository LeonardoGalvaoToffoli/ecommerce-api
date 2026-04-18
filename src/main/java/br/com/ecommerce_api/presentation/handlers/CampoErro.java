package br.com.ecommerce_api.presentation.handlers;

public record CampoErro(
        String campo,
        String mensagem
) {
}