package br.com.ecommerce_api.infrastructure.security;

import br.com.ecommerce_api.domain.entities.Usuario;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.assertThat;

class TokenServiceTest {

    private TokenService tokenService;
    private Usuario usuario;

    @BeforeEach
    void setUp() {
        tokenService = new TokenService();
        ReflectionTestUtils.setField(tokenService, "secret", "segredo-de-teste-123");

        usuario = new Usuario();
        usuario.setId(1L);
        usuario.setEmail("joao@exemplo.com");
        usuario.setRole("ROLE_ADMIN");
    }

    @Test
    @DisplayName("gerarToken e validarToken devem fazer roundtrip do subject")
    void gerarEValidar_roundtrip() {
        String token = tokenService.gerarToken(usuario);

        assertThat(token).isNotBlank();
        assertThat(tokenService.validarToken(token)).isEqualTo("joao@exemplo.com");
    }

    @Test
    @DisplayName("validarToken com assinatura diferente deve retornar string vazia")
    void validarToken_assinaturaDiferenteRetornaVazio() {
        String token = tokenService.gerarToken(usuario);

        TokenService outro = new TokenService();
        ReflectionTestUtils.setField(outro, "secret", "outro-segredo");

        assertThat(outro.validarToken(token)).isEmpty();
    }

    @Test
    @DisplayName("validarToken com lixo retorna string vazia em vez de explodir")
    void validarToken_lixoRetornaVazio() {
        assertThat(tokenService.validarToken("nao-eh-um-jwt")).isEmpty();
        assertThat(tokenService.validarToken("")).isEmpty();
    }
}
