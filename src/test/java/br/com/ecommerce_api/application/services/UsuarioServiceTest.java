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
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
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
    @DisplayName("listarAdmins delega para query derivada com role ROLE_ADMIN")
    void listarAdmins_buscaPorRole() {
        Usuario adm = new Usuario();
        adm.setId(1L);
        adm.setNome("Joao");
        adm.setEmail("joao@exemplo.com");
        adm.setCpf("11122233344");
        adm.setTelefone("119");
        adm.setRole("ROLE_ADMIN");
        adm.setAtivo(true);
        adm.setDataCadastro(LocalDateTime.now());

        when(repository.findByRoleOrderByDataCadastroDesc("ROLE_ADMIN")).thenReturn(List.of(adm));

        var result = service.listarAdmins();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).email()).isEqualTo("joao@exemplo.com");
        assertThat(result.get(0).role()).isEqualTo("ROLE_ADMIN");
    }

    @Test
    @DisplayName("definirAtivo seta ativo=false e persiste")
    void definirAtivo_desativa() {
        Usuario alvo = new Usuario();
        alvo.setId(42L);
        alvo.setAtivo(true);

        Usuario solicitante = new Usuario();
        solicitante.setId(1L);

        when(repository.findById(42L)).thenReturn(Optional.of(alvo));
        when(repository.save(any(Usuario.class))).thenAnswer(invocation -> invocation.getArgument(0));

        service.definirAtivo(42L, false, solicitante);

        assertThat(alvo.getAtivo()).isFalse();
        verify(repository).save(alvo);
    }

    @Test
    @DisplayName("definirAtivo bloqueia auto-desativacao")
    void definirAtivo_autoDesativacaoLancaConflito() {
        Usuario eu = new Usuario();
        eu.setId(1L);
        eu.setAtivo(true);

        when(repository.findById(1L)).thenReturn(Optional.of(eu));

        assertThatThrownBy(() -> service.definirAtivo(1L, false, eu))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("proprio usuario");
    }

    @Test
    @DisplayName("definirAtivo com id inexistente lanca 404")
    void definirAtivo_idInexistenteLanca404() {
        when(repository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.definirAtivo(999L, true, null))
                .isInstanceOf(ResponseStatusException.class);
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
