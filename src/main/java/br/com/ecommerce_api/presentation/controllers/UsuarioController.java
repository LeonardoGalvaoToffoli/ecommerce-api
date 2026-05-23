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

import java.util.List;
import java.util.Map;

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

    @PostMapping("/admin")
    public ResponseEntity<UsuarioResponseDTO> criarAdmin(@Valid @RequestBody UsuarioRequestDTO dto) {
        UsuarioResponseDTO response = service.criarAdmin(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/admins")
    public ResponseEntity<List<UsuarioResponseDTO>> listarAdmins() {
        return ResponseEntity.ok(service.listarAdmins());
    }

    @PatchMapping("/{id}/ativo")
    public ResponseEntity<UsuarioResponseDTO> definirAtivo(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> body,
            @AuthenticationPrincipal Usuario solicitante) {

        Boolean ativo = body.get("ativo");
        if (ativo == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(service.definirAtivo(id, ativo, solicitante));
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