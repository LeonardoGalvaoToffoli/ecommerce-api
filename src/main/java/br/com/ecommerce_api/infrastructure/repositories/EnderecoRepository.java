package br.com.ecommerce_api.infrastructure.repositories;

import br.com.ecommerce_api.domain.entities.Endereco;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EnderecoRepository extends JpaRepository<Endereco, Long> {
}