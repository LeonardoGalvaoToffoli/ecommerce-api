package br.com.ecommerce_api.application.dtos;

import br.com.ecommerce_api.domain.entities.Usuario;
import java.time.LocalDateTime;

public record UsuarioResponseDTO(
        Long id,
        String nome,
        String email,
        String cpf,
        String telefone,
        String role,
        Boolean ativo,
        LocalDateTime dataCadastro
) {
    public UsuarioResponseDTO(Usuario usuario) {
        this(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getCpf(),
                usuario.getTelefone(),
                usuario.getRole(),
                usuario.getAtivo(),
                usuario.getDataCadastro()
        );
    }
}