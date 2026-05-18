package br.com.ecommerce_api.domain.factories;

import br.com.ecommerce_api.domain.entities.Produto;
import br.com.ecommerce_api.domain.entities.Variacao;
import java.math.BigDecimal;

public class ProdutoFactory {

    public static Produto criarCamisa(String nome, String descricao, BigDecimal precoBase, String imagemUrl, String tamanho, String cor, Integer estoqueInicial) {

        Produto produto = new Produto();
        produto.setNome(nome);
        produto.setDescricao(descricao);
        produto.setPrecoBase(precoBase);
        produto.setImagemUrl(imagemUrl);
        produto.setAtivo(true);
        produto.setDestaque(false);

        Variacao variacao = new Variacao();
        variacao.setTamanho(tamanho);
        variacao.setCor(cor);
        variacao.setQuantidadeEstoque(estoqueInicial);

        produto.addVariacao(variacao);

        return produto;
    }
}
