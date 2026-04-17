package br.com.ecommerce_api.application.services;

import br.com.ecommerce_api.application.dtos.ProdutoRequestDTO;
import br.com.ecommerce_api.application.dtos.ProdutoResponseDTO;
import br.com.ecommerce_api.domain.entities.Produto;
import br.com.ecommerce_api.domain.factories.ProdutoFactory;
import br.com.ecommerce_api.infrastructure.repositories.ProdutoRepository;
import org.springframework.stereotype.Service;

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
                dto.tamanho(),
                dto.cor(),
                dto.estoqueInicial()
        );

        Produto salvo = repository.save(produto);

        return new ProdutoResponseDTO(salvo);
    }
}