package br.com.ecommerce_api.infrastructure.repositories;

import br.com.ecommerce_api.domain.entities.Variacao;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VariacaoRepository extends JpaRepository<Variacao, Long> {
}