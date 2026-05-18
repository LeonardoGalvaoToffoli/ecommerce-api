package br.com.ecommerce_api.application.services;

import br.com.ecommerce_api.application.dtos.ProdutoAtualizacaoDTO;
import br.com.ecommerce_api.application.dtos.ProdutoDetalheDTO;
import br.com.ecommerce_api.application.dtos.ProdutoRequestDTO;
import br.com.ecommerce_api.application.dtos.ProdutoResponseDTO;
import br.com.ecommerce_api.domain.entities.Produto;
import br.com.ecommerce_api.domain.entities.Variacao;
import br.com.ecommerce_api.infrastructure.repositories.ProdutoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProdutoServiceTest {

    @Mock
    private ProdutoRepository repository;

    @InjectMocks
    private ProdutoService service;

    private Produto produtoExistente;

    @BeforeEach
    void setUp() {
        produtoExistente = new Produto();
        produtoExistente.setId(1L);
        produtoExistente.setNome("Camisa Basica Preta");
        produtoExistente.setDescricao("Algodao premium");
        produtoExistente.setPrecoBase(new BigDecimal("89.90"));
        produtoExistente.setImagemUrl("https://cdn.exemplo.com/preta.jpg");
        produtoExistente.setAtivo(true);
        produtoExistente.setDestaque(false);

        Variacao variacao = new Variacao();
        variacao.setId(10L);
        variacao.setTamanho("M");
        variacao.setCor("Preto");
        variacao.setQuantidadeEstoque(5);
        produtoExistente.setVariacoes(new ArrayList<>(List.of(variacao)));
    }

    @Test
    @DisplayName("criar deve persistir com destaque=false e ativo=true e devolver o DTO")
    void criar_persisteComDefaults() {
        ProdutoRequestDTO dto = new ProdutoRequestDTO(
                "Camisa Nova",
                "Descricao",
                new BigDecimal("99.90"),
                "https://cdn.exemplo.com/nova.jpg",
                "M",
                "Branco",
                10
        );

        when(repository.save(any(Produto.class))).thenAnswer(invocation -> {
            Produto entrada = invocation.getArgument(0);
            entrada.setId(99L);
            return entrada;
        });

        ProdutoResponseDTO response = service.criar(dto);

        ArgumentCaptor<Produto> captor = ArgumentCaptor.forClass(Produto.class);
        org.mockito.Mockito.verify(repository).save(captor.capture());
        Produto salvo = captor.getValue();

        assertThat(salvo.getNome()).isEqualTo("Camisa Nova");
        assertThat(salvo.getImagemUrl()).isEqualTo("https://cdn.exemplo.com/nova.jpg");
        assertThat(salvo.getAtivo()).isTrue();
        assertThat(salvo.getDestaque()).isFalse();
        assertThat(salvo.getVariacoes()).hasSize(1);
        assertThat(salvo.getVariacoes().get(0).getTamanho()).isEqualTo("M");

        assertThat(response.id()).isEqualTo(99L);
        assertThat(response.destaque()).isFalse();
    }

    @Test
    @DisplayName("atualizar deve sobrescrever campos editaveis e preservar id/variacoes")
    void atualizar_sobrescreveCamposEditaveis() {
        when(repository.findById(1L)).thenReturn(Optional.of(produtoExistente));
        when(repository.save(any(Produto.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ProdutoAtualizacaoDTO dto = new ProdutoAtualizacaoDTO(
                "Camisa Renomeada",
                "Nova descricao",
                new BigDecimal("129.90"),
                "https://cdn.exemplo.com/renomeada.jpg",
                false,
                true
        );

        ProdutoResponseDTO response = service.atualizar(1L, dto);

        assertThat(produtoExistente.getNome()).isEqualTo("Camisa Renomeada");
        assertThat(produtoExistente.getPrecoBase()).isEqualByComparingTo("129.90");
        assertThat(produtoExistente.getAtivo()).isFalse();
        assertThat(produtoExistente.getDestaque()).isTrue();
        // variacoes nao devem ser tocadas
        assertThat(produtoExistente.getVariacoes()).hasSize(1);
        assertThat(response.destaque()).isTrue();
        assertThat(response.ativo()).isFalse();
    }

    @Test
    @DisplayName("atualizar com id inexistente deve lancar 404")
    void atualizar_idInexistenteLancaErro() {
        when(repository.findById(999L)).thenReturn(Optional.empty());

        ProdutoAtualizacaoDTO dto = new ProdutoAtualizacaoDTO(
                "x", "y", new BigDecimal("1.00"), null, true, false
        );

        assertThatThrownBy(() -> service.atualizar(999L, dto))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Produto");
    }

    @Test
    @DisplayName("buscarProdutoPorId deve mapear variacoes para DTO")
    void buscarProdutoPorId_mapeiaVariacoes() {
        when(repository.findById(1L)).thenReturn(Optional.of(produtoExistente));

        ProdutoDetalheDTO detalhe = service.buscarProdutoPorId(1L);

        assertThat(detalhe.id()).isEqualTo(1L);
        assertThat(detalhe.imagemUrl()).isEqualTo("https://cdn.exemplo.com/preta.jpg");
        assertThat(detalhe.variacoes()).hasSize(1);
        assertThat(detalhe.variacoes().get(0).tamanho()).isEqualTo("M");
        assertThat(detalhe.variacoes().get(0).quantidadeEstoque()).isEqualTo(5);
    }

    @Test
    @DisplayName("buscarProdutoPorId nao encontrado deve lancar 404")
    void buscarProdutoPorId_inexistenteLancaErro() {
        when(repository.findById(42L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.buscarProdutoPorId(42L))
                .isInstanceOf(ResponseStatusException.class);
    }

    @Test
    @DisplayName("listarDestaques deve delegar pra query derivada do repository")
    void listarDestaques_chamaQueryDerivada() {
        Produto destaque = new Produto();
        destaque.setId(7L);
        destaque.setNome("Camisa Estampa Limitada");
        destaque.setPrecoBase(new BigDecimal("199.00"));
        destaque.setAtivo(true);
        destaque.setDestaque(true);

        when(repository.findByDestaqueTrueAndAtivoTrueOrderByIdDesc())
                .thenReturn(List.of(destaque));

        List<ProdutoResponseDTO> result = service.listarDestaques();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).id()).isEqualTo(7L);
        assertThat(result.get(0).destaque()).isTrue();
    }
}
