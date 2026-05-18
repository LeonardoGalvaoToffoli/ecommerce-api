package br.com.ecommerce_api.presentation.controllers;

import br.com.ecommerce_api.application.dtos.ProdutoAtualizacaoDTO;
import br.com.ecommerce_api.application.dtos.ProdutoRequestDTO;
import br.com.ecommerce_api.application.dtos.ProdutoResponseDTO;
import br.com.ecommerce_api.application.dtos.ProdutoDetalheDTO;
import br.com.ecommerce_api.application.services.ProdutoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@RestController
@RequestMapping("/api/produtos")
public class ProdutoController {

    private final ProdutoService service;

    public ProdutoController(ProdutoService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<ProdutoResponseDTO> criar(@Valid @RequestBody ProdutoRequestDTO dto) {
        ProdutoResponseDTO response = service.criar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProdutoResponseDTO> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody ProdutoAtualizacaoDTO dto) {
        ProdutoResponseDTO response = service.atualizar(id, dto);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<Page<ProdutoResponseDTO>> listar(
            @PageableDefault(size = 20, sort = "nome") Pageable pageable) {

        var page = service.listarVitrine(pageable);
        return ResponseEntity.ok(page);
    }

    @GetMapping("/destaques")
    public ResponseEntity<List<ProdutoResponseDTO>> listarDestaques() {
        return ResponseEntity.ok(service.listarDestaques());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProdutoDetalheDTO> buscarPorId(@PathVariable Long id) {
        ProdutoDetalheDTO produto = service.buscarProdutoPorId(id);
        return ResponseEntity.ok(produto);
    }
}