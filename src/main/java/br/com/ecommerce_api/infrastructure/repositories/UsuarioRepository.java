package br.com.ecommerce_api.infrastructure.repositories;

import br.com.ecommerce_api.domain.entities.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
}