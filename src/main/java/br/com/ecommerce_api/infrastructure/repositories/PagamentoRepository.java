package br.com.ecommerce_api.infrastructure.repositories;

import br.com.ecommerce_api.domain.entities.Pagamento;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PagamentoRepository extends JpaRepository<Pagamento, Long> {
    Optional<Pagamento> findByCodigoPix(String codigoPix);
}