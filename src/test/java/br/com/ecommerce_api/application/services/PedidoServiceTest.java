package br.com.ecommerce_api.application.services;

import br.com.ecommerce_api.application.dtos.PedidoAdminDTO;
import br.com.ecommerce_api.application.dtos.PedidoPagoEvent;
import br.com.ecommerce_api.domain.entities.Pagamento;
import br.com.ecommerce_api.domain.entities.Pedido;
import br.com.ecommerce_api.domain.entities.Usuario;
import br.com.ecommerce_api.infrastructure.messaging.PedidoEventProducer;
import br.com.ecommerce_api.infrastructure.repositories.EnderecoRepository;
import br.com.ecommerce_api.infrastructure.repositories.PagamentoRepository;
import br.com.ecommerce_api.infrastructure.repositories.PedidoRepository;
import br.com.ecommerce_api.infrastructure.repositories.UsuarioRepository;
import br.com.ecommerce_api.infrastructure.repositories.VariacaoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PedidoServiceTest {

    @Mock private PedidoRepository pedidoRepository;
    @Mock private UsuarioRepository usuarioRepository;
    @Mock private VariacaoRepository variacaoRepository;
    @Mock private EnderecoRepository enderecoRepository;
    @Mock private PagamentoRepository pagamentoRepository;
    @Mock private PedidoEventProducer pedidoEventProducer;

    @InjectMocks
    private PedidoService service;

    private Usuario cliente;
    private Pedido pedido;
    private Pagamento pagamento;

    @BeforeEach
    void setUp() {
        cliente = new Usuario();
        cliente.setId(7L);
        cliente.setNome("Maria Cliente");
        cliente.setEmail("maria@exemplo.com");

        pagamento = new Pagamento();
        pagamento.setId(100L);
        pagamento.setCodigoPix("PIX-abc-123");
        pagamento.setStatus("PENDENTE");

        pedido = new Pedido();
        pedido.setId(42L);
        pedido.setUsuario(cliente);
        pedido.setDataPedido(LocalDateTime.of(2026, 5, 18, 13, 0));
        pedido.setStatus("AGUARDANDO_PAGAMENTO");
        pedido.setValorTotal(new BigDecimal("250.00"));
        pedido.definirPagamento(pagamento);
    }

    @Test
    @DisplayName("listarTodosAdmin mapeia dados do cliente e do pagamento")
    void listarTodosAdmin_mapeiaCamposCliente() {
        Page<Pedido> page = new PageImpl<>(List.of(pedido));
        when(pedidoRepository.findAll(any(PageRequest.class))).thenReturn(page);

        Page<PedidoAdminDTO> result = service.listarTodosAdmin(PageRequest.of(0, 10));

        assertThat(result.getContent()).hasSize(1);
        PedidoAdminDTO dto = result.getContent().get(0);
        assertThat(dto.pedidoId()).isEqualTo(42L);
        assertThat(dto.clienteNome()).isEqualTo("Maria Cliente");
        assertThat(dto.clienteEmail()).isEqualTo("maria@exemplo.com");
        assertThat(dto.codigoPix()).isEqualTo("PIX-abc-123");
        assertThat(dto.statusPagamento()).isEqualTo("PENDENTE");
        assertThat(dto.valorTotal()).isEqualByComparingTo("250.00");
    }

    @Test
    @DisplayName("simularPixPago com id inexistente lanca 404")
    void simularPixPago_pedidoInexistente_lanca404() {
        when(pedidoRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.simularPixPago(999L))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Pedido");
    }

    @Test
    @DisplayName("simularPixPago em pedido sem pagamento lanca 409")
    void simularPixPago_pedidoSemPagamento_lanca409() {
        Pedido orfa = new Pedido();
        orfa.setId(5L);
        orfa.setUsuario(cliente);
        // sem pagamento associado
        when(pedidoRepository.findById(5L)).thenReturn(Optional.of(orfa));

        assertThatThrownBy(() -> service.simularPixPago(5L))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("sem pagamento");
    }

    @Test
    @DisplayName("simularPixPago aprova pagamento e dispara evento")
    void simularPixPago_aprovaEDispararEvento() {
        when(pedidoRepository.findById(42L)).thenReturn(Optional.of(pedido));
        when(pagamentoRepository.findByCodigoPix("PIX-abc-123")).thenReturn(Optional.of(pagamento));

        PedidoAdminDTO dto = service.simularPixPago(42L);

        assertThat(pagamento.getStatus()).isEqualTo("PAGO");
        assertThat(pagamento.getDataPagamento()).isNotNull();
        assertThat(pedido.getStatus()).isEqualTo("PAGO");
        verify(pedidoEventProducer).enviarPedidoPago(any(PedidoPagoEvent.class));
        assertThat(dto.statusPedido()).isEqualTo("PAGO");
    }

    @Test
    @DisplayName("simularPixPago em pedido ja pago e idempotente (sem disparar evento de novo)")
    void simularPixPago_jaPago_eIdempotente() {
        pagamento.setStatus("PAGO");
        pedido.setStatus("PAGO");

        when(pedidoRepository.findById(42L)).thenReturn(Optional.of(pedido));
        when(pagamentoRepository.findByCodigoPix("PIX-abc-123")).thenReturn(Optional.of(pagamento));

        PedidoAdminDTO dto = service.simularPixPago(42L);

        verify(pedidoEventProducer, never()).enviarPedidoPago(any());
        verify(pagamentoRepository, never()).save(any());
        assertThat(dto.statusPedido()).isEqualTo("PAGO");
    }

    @Test
    @DisplayName("simularPixPago multiplas chamadas: primeira dispara, segunda nao")
    void simularPixPago_multiplasChamadas_eventoUmaVez() {
        when(pedidoRepository.findById(42L)).thenReturn(Optional.of(pedido));
        when(pagamentoRepository.findByCodigoPix("PIX-abc-123")).thenReturn(Optional.of(pagamento));

        service.simularPixPago(42L);
        service.simularPixPago(42L);

        verify(pedidoEventProducer, times(1)).enviarPedidoPago(any(PedidoPagoEvent.class));
    }
}
