package br.com.ecommerce_api.application.services;

import br.com.ecommerce_api.application.dtos.ProdutoAtualizacaoDTO;
import br.com.ecommerce_api.application.dtos.ProdutoRequestDTO;
import br.com.ecommerce_api.application.dtos.ProdutoResponseDTO;
import br.com.ecommerce_api.application.dtos.ProdutoDetalheDTO;
import br.com.ecommerce_api.application.dtos.VariacaoDTO;
import br.com.ecommerce_api.domain.entities.Produto;
import br.com.ecommerce_api.domain.factories.ProdutoFactory;
import br.com.ecommerce_api.infrastructure.repositories.ProdutoRepository;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ProdutoService {

    private final ProdutoRepository repository;

    public ProdutoService(ProdutoRepository repository) {
        this.repository = repository;
    }

    public ProdutoResponseDTO criar(ProdutoRequestDTO dto) {
        Produto produto = ProdutoFactory.criarCamisa(
                dto.nome(),
                dto.descricao(),
                dto.precoBase(),
                dto.imagemUrl(),
                dto.tamanho(),
                dto.cor(),
                dto.estoqueInicial()
        );

        Produto salvo = repository.save(produto);

        return new ProdutoResponseDTO(salvo);
    }

    @Transactional
    public ProdutoResponseDTO atualizar(Long id, ProdutoAtualizacaoDTO dto) {
        Produto produto = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Produto não encontrado"));

        produto.setNome(dto.nome());
        produto.setDescricao(dto.descricao());
        produto.setPrecoBase(dto.precoBase());
        produto.setImagemUrl(dto.imagemUrl());
        produto.setAtivo(dto.ativo());
        produto.setDestaque(dto.destaque());

        Produto salvo = repository.save(produto);

        return new ProdutoResponseDTO(salvo);
    }

    public Page<ProdutoResponseDTO> listarVitrine(Pageable pageable) {
        return repository.findAll(pageable)
                .map(ProdutoResponseDTO::new);
    }

    public List<ProdutoResponseDTO> listarDestaques() {
        return repository.findByDestaqueTrueAndAtivoTrueOrderByIdDesc()
                .stream()
                .map(ProdutoResponseDTO::new)
                .toList();
    }

    public ProdutoDetalheDTO buscarProdutoPorId(Long id) {
        Produto produto = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Produto não encontrado"));

        // Mapeia a lista de variações daquele produto
        List<VariacaoDTO> variacoesDTO = produto.getVariacoes().stream()
                .map(v -> new VariacaoDTO(
                        v.getId(),
                        v.getTamanho(),
                        v.getCor(),
                        v.getQuantidadeEstoque()
                )).toList();

        // Monta o DTO final do produto
        return new ProdutoDetalheDTO(
                produto.getId(),
                produto.getNome(),
                produto.getDescricao(),
                produto.getPrecoBase(),
                produto.getImagemUrl(),
                produto.getAtivo(),
                Boolean.TRUE.equals(produto.getDestaque()),
                variacoesDTO
        );
    }
}