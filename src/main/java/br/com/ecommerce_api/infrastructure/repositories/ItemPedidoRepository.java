package br.com.ecommerce_api.infrastructure.repositories;

import br.com.ecommerce_api.domain.entities.ItemPedido;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ItemPedidoRepository extends JpaRepository<ItemPedido, Long> {
}