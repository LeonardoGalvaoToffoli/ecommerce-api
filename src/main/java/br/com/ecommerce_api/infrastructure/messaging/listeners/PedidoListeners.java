package br.com.ecommerce_api.infrastructure.messaging.listeners;

import br.com.ecommerce_api.application.dtos.PedidoPagoEvent;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class PedidoListeners {

    @RabbitListener(queues = "pedido.estoque.queue")
    public void processarEstoque(PedidoPagoEvent evento) {
        System.out.println("[ESTOQUE] - Iniciando separacao fisica para o Pedido ID: " + evento.pedidoId());
    }

    @RabbitListener(queues = "pedido.notafiscal.queue")
    public void processarNotaFiscal(PedidoPagoEvent evento) {
        System.out.println("[NOTA FISCAL] - Gerando XML da NF-e para o Pedido ID: " + evento.pedidoId());
    }

    @RabbitListener(queues = "pedido.entrega.queue")
    public void processarEntrega(PedidoPagoEvent evento) {
        System.out.println("[LOGISTICA] - Solicitando coleta da transportadora para o Pedido ID: " + evento.pedidoId());
    }
}