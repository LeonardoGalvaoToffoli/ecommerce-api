package br.com.ecommerce_api.application.services;

import br.com.ecommerce_api.application.dtos.UsuarioAtualizacaoDTO;
import br.com.ecommerce_api.application.dtos.UsuarioPerfilDTO;
import br.com.ecommerce_api.application.dtos.UsuarioRequestDTO;
import br.com.ecommerce_api.application.dtos.UsuarioResponseDTO;
import br.com.ecommerce_api.domain.entities.Usuario;
import br.com.ecommerce_api.infrastructure.repositories.UsuarioRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {

    @Mock
    private UsuarioRepository repository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UsuarioService service;

    @Test
    @DisplayName("criar deve sempre setar ROLE_USER independente do payload")
    void criar_setaRoleUser() {
        UsuarioRequestDTO dto = new UsuarioRequestDTO(
                "Cliente",
                "cliente@exemplo.com",
                "senha123",
                "11122233344",
                "11999999999"
        );

        when(passwordEncoder.encode("senha123")).thenReturn("HASH");
        when(repository.save(any(Usuario.class))).thenAnswer(invocation -> {
            Usuario u = invocation.getArgument(0);
            u.setId(1L);
            return u;
        });

        UsuarioResponseDTO response = service.criar(dto);

        ArgumentCaptor<Usuario> captor = ArgumentCaptor.forClass(Usuario.class);
        verify(repository).save(captor.capture());
        Usuario salvo = captor.getValue();

        assertThat(salvo.getRole()).isEqualTo("ROLE_USER");
        assertThat(salvo.getSenha()).isEqualTo("HASH");
        assertThat(salvo.getAtivo()).isTrue();
        assertThat(salvo.getDataCadastro()).isNotNull();
        assertThat(response.role()).isEqualTo("ROLE_USER");
    }

    @Test
    @DisplayName("criarAdmin deve setar ROLE_ADMIN")
    void criarAdmin_setaRoleAdmin() {
        UsuarioRequestDTO dto = new UsuarioRequestDTO(
                "Admin",
                "admin@exemplo.com",
                "outraSenha",
                "55566677788",
                "11988888888"
        );

        when(passwordEncoder.encode("outraSenha")).thenReturn("ADMINHASH");
        when(repository.save(any(Usuario.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UsuarioResponseDTO response = service.criarAdmin(dto);

        ArgumentCaptor<Usuario> captor = ArgumentCaptor.forClass(Usuario.class);
        verify(repository).save(captor.capture());
        Usuario salvo = captor.getValue();

        assertThat(salvo.getRole()).isEqualTo("ROLE_ADMIN");
        assertThat(salvo.getSenha()).isEqualTo("ADMINHASH");
        assertThat(response.role()).isEqualTo("ROLE_ADMIN");
    }

    @Test
    @DisplayName("atualizarPerfil deve mudar nome e telefone preservando demais campos")
    void atualizarPerfil_alteraNomeTelefone() {
        Usuario logado = new Usuario();
        logado.setId(1L);
        logado.setNome("Antigo");
        logado.setEmail("usuario@exemplo.com");
        logado.setCpf("11122233344");
        logado.setTelefone("11999999999");
        logado.setRole("ROLE_USER");
        logado.setAtivo(true);

        when(repository.findById(1L)).thenReturn(Optional.of(logado));
        when(repository.save(any(Usuario.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UsuarioAtualizacaoDTO dto = new UsuarioAtualizacaoDTO("Novo Nome", "11977777777");
        UsuarioPerfilDTO perfil = service.atualizarPerfil(logado, dto);

        assertThat(perfil.nome()).isEqualTo("Novo Nome");
        assertThat(perfil.telefone()).isEqualTo("11977777777");
        // imutaveis
        assertThat(perfil.email()).isEqualTo("usuario@exemplo.com");
        assertThat(perfil.cpf()).isEqualTo("11122233344");
    }
}
