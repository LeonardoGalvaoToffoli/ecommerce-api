package br.com.ecommerce_api.application.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import org.hibernate.validator.constraints.URL;
import java.math.BigDecimal;

public record ProdutoAtualizacaoDTO(
        @NotBlank String nome,
        @NotBlank String descricao,
        @NotNull @Positive BigDecimal precoBase,
        @URL @Size(max = 1024) String imagemUrl,
        @NotNull Boolean ativo,
        @NotNull Boolean destaque
) {
}
