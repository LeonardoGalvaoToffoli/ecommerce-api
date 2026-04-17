package br.com.ecommerce_api.application.dtos;

import br.com.ecommerce_api.domain.entities.Produto;
import java.math.BigDecimal;

public record ProdutoResponseDTO(
        Long id,
        String nome,
        String descricao,
        BigDecimal precoBase,
        Boolean ativo
) {
    public ProdutoResponseDTO(Produto produto) {
        this(
                produto.getId(),
                produto.getNome(),
                produto.getDescricao(),
                produto.getPrecoBase(),
                produto.getAtivo()
        );
    }
}