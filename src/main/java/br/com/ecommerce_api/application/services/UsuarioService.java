package br.com.ecommerce_api.application.services;

import br.com.ecommerce_api.application.dtos.UsuarioRequestDTO;
import br.com.ecommerce_api.application.dtos.UsuarioResponseDTO;
import br.com.ecommerce_api.domain.entities.Usuario;
import br.com.ecommerce_api.application.dtos.UsuarioAtualizacaoDTO;
import br.com.ecommerce_api.application.dtos.UsuarioPerfilDTO;
import br.com.ecommerce_api.infrastructure.repositories.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

@Service
public class UsuarioService {

    private final UsuarioRepository repository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    public UsuarioResponseDTO criar(UsuarioRequestDTO dto) {
        Usuario usuario = new Usuario();
        usuario.setNome(dto.nome());
        usuario.setEmail(dto.email());
        usuario.setSenha(passwordEncoder.encode(dto.senha()));
        usuario.setCpf(dto.cpf());
        usuario.setTelefone(dto.telefone());
        usuario.setRole("ROLE_USER");
        usuario.setAtivo(true);
        usuario.setDataCadastro(LocalDateTime.now());

        Usuario salvo = repository.save(usuario);

        return new UsuarioResponseDTO(salvo);
    }

    @Transactional // Garante o rollback no banco caso dê erro no meio do processo
    public UsuarioPerfilDTO atualizarPerfil(Usuario usuarioLogado, UsuarioAtualizacaoDTO dto) {
        // Buscamos o usuário fresco do banco para garantir que o Hibernate o gerencie
        Usuario usuario = repository.findById(usuarioLogado.getId())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        usuario.setNome(dto.nome());
        usuario.setTelefone(dto.telefone());

        usuario = repository.save(usuario);

        return new UsuarioPerfilDTO(usuario);
    }
}