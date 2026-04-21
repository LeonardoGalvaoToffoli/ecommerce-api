package br.com.ecommerce_api.application.dtos;

import br.com.ecommerce_api.domain.entities.Usuario;

public record UsuarioPerfilDTO(
        Long id,
        String nome,
        String email,
        String cpf,
        String telefone
) {
    // Construtor prático para converter a entidade direto para DTO
    public UsuarioPerfilDTO(Usuario usuario) {
        this(usuario.getId(), usuario.getNome(), usuario.getEmail(), usuario.getCpf(), usuario.getTelefone());
    }
}