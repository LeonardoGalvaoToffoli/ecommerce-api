package br.com.ecommerce_api.infrastructure.messaging;

import org.springframework.amqp.core.*;
import org.springframework.amqp.support.converter.JacksonJsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String EXCHANGE_NAME = "pedido.events.topic";
    public static final String ROUTING_KEY_PAGO = "pedido.pago";

    @Bean
    public TopicExchange pedidoExchange() {
        return new TopicExchange(EXCHANGE_NAME);
    }

    @Bean
    public Queue estoqueQueue() {
        return new Queue("pedido.estoque.queue");
    }

    @Bean
    public Queue notaFiscalQueue() {
        return new Queue("pedido.notafiscal.queue");
    }

    @Bean
    public Queue entregaQueue() {
        return new Queue("pedido.entrega.queue");
    }

    @Bean
    public Binding estoqueBinding() {
        return BindingBuilder.bind(estoqueQueue()).to(pedidoExchange()).with(ROUTING_KEY_PAGO);
    }

    @Bean
    public Binding notaFiscalBinding() {
        return BindingBuilder.bind(notaFiscalQueue()).to(pedidoExchange()).with(ROUTING_KEY_PAGO);
    }

    @Bean
    public Binding entregaBinding() {
        return BindingBuilder.bind(entregaQueue()).to(pedidoExchange()).with(ROUTING_KEY_PAGO);
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new JacksonJsonMessageConverter();
    }
}