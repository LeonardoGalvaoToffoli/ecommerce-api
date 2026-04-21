package br.com.ecommerce_api.presentation.controllers;

import br.com.ecommerce_api.application.dtos.UsuarioRequestDTO;
import br.com.ecommerce_api.application.dtos.UsuarioResponseDTO;
import br.com.ecommerce_api.application.services.UsuarioService;
import br.com.ecommerce_api.application.dtos.UsuarioAtualizacaoDTO;
import br.com.ecommerce_api.application.dtos.UsuarioPerfilDTO;
import br.com.ecommerce_api.domain.entities.Usuario;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService service;

    public UsuarioController(UsuarioService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<UsuarioResponseDTO> criar(@Valid @RequestBody UsuarioRequestDTO dto) {
        UsuarioResponseDTO response = service.criar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/perfil")
    public ResponseEntity<UsuarioPerfilDTO> atualizarPerfil(
            @AuthenticationPrincipal Usuario usuarioLogado,
            @Valid @RequestBody UsuarioAtualizacaoDTO dto) {

        UsuarioPerfilDTO perfilAtualizado = service.atualizarPerfil(usuarioLogado, dto);
        return ResponseEntity.ok(perfilAtualizado);
    }

    @GetMapping("/perfil")
    public ResponseEntity<UsuarioPerfilDTO> buscarMeuPerfil(@AuthenticationPrincipal Usuario usuarioLogado) {

        return ResponseEntity.ok(new UsuarioPerfilDTO(usuarioLogado));
    }
}