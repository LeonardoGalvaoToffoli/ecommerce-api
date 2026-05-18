package br.com.ecommerce_api.application.dtos;

import java.math.BigDecimal;
import java.util.List;

public record ProdutoDetalheDTO(
        Long id,
        String nome,
        String descricao,
        BigDecimal precoBase,
        String imagemUrl,
        Boolean ativo,
        Boolean destaque,
        List<VariacaoDTO> variacoes
) {
}
