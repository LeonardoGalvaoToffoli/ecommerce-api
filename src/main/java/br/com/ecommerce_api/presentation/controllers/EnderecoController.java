package br.com.ecommerce_api.presentation.controllers;

import br.com.ecommerce_api.application.dtos.EnderecoRequestDTO;
import br.com.ecommerce_api.application.dtos.EnderecoResponseDTO;
import br.com.ecommerce_api.application.services.EnderecoService;
import br.com.ecommerce_api.domain.entities.Usuario;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enderecos")
public class EnderecoController {

    private final EnderecoService service;

    public EnderecoController(EnderecoService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<EnderecoResponseDTO>> listarMeusEnderecos(@AuthenticationPrincipal Usuario usuarioLogado) {
        return ResponseEntity.ok(service.listarMeusEnderecos(usuarioLogado));
    }

    @PostMapping
    public ResponseEntity<EnderecoResponseDTO> adicionarEndereco(
            @AuthenticationPrincipal Usuario usuarioLogado,
            @Valid @RequestBody EnderecoRequestDTO dto) {

        EnderecoResponseDTO response = service.adicionarEndereco(usuarioLogado, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EnderecoResponseDTO> atualizarEndereco(
            @PathVariable Long id,
            @AuthenticationPrincipal Usuario usuarioLogado,
            @Valid @RequestBody EnderecoRequestDTO dto) {

        EnderecoResponseDTO response = service.atualizarEndereco(id, usuarioLogado, dto);
        return ResponseEntity.ok(response);
    }
}