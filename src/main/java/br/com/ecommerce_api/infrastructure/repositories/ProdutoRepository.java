package br.com.ecommerce_api.infrastructure.repositories;

import br.com.ecommerce_api.domain.entities.Produto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {
}