package br.com.ecommerce_api.application.dtos;

import br.com.ecommerce_api.domain.entities.Produto;
import java.math.BigDecimal;

public record ProdutoResponseDTO(
        Long id,
        String nome,
        String descricao,
        BigDecimal precoBase,
        String imagemUrl,
        Boolean ativo,
        Boolean destaque
) {
    public ProdutoResponseDTO(Produto produto) {
        this(
                produto.getId(),
                produto.getNome(),
                produto.getDescricao(),
                produto.getPrecoBase(),
                produto.getImagemUrl(),
                produto.getAtivo(),
                Boolean.TRUE.equals(produto.getDestaque())
        );
    }
}
