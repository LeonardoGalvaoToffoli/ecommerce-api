package br.com.ecommerce_api.application.dtos;

public record VariacaoDTO(
        Long id,
        String tamanho,
        String cor,
        Integer quantidadeEstoque
) {
}