package br.com.ecommerce_api.domain.factories;

import br.com.ecommerce_api.domain.entities.Produto;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;

class ProdutoFactoryTest {

    @Test
    @DisplayName("criarCamisa deve criar produto ativo, nao destacado e com uma variacao")
    void criarCamisa_defaults() {
        Produto produto = ProdutoFactory.criarCamisa(
                "Camisa Branca",
                "Algodao",
                new BigDecimal("79.90"),
                "https://cdn.exemplo.com/branca.jpg",
                "G",
                "Branco",
                15
        );

        assertThat(produto.getNome()).isEqualTo("Camisa Branca");
        assertThat(produto.getImagemUrl()).isEqualTo("https://cdn.exemplo.com/branca.jpg");
        assertThat(produto.getAtivo()).isTrue();
        assertThat(produto.getDestaque()).isFalse();
        assertThat(produto.getVariacoes())
                .hasSize(1)
                .first()
                .satisfies(v -> {
                    assertThat(v.getTamanho()).isEqualTo("G");
                    assertThat(v.getCor()).isEqualTo("Branco");
                    assertThat(v.getQuantidadeEstoque()).isEqualTo(15);
                    assertThat(v.getProduto()).isSameAs(produto);
                });
    }
}
