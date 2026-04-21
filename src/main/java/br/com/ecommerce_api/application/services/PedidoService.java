package br.com.ecommerce_api.application.services;

import br.com.ecommerce_api.application.dtos.*;
import br.com.ecommerce_api.domain.entities.*;
import br.com.ecommerce_api.infrastructure.messaging.PedidoEventProducer;
import br.com.ecommerce_api.infrastructure.repositories.*;
import br.com.ecommerce_api.application.dtos.PedidoHistoricoDTO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;
import java.util.List;

@Service
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final UsuarioRepository usuarioRepository;
    private final VariacaoRepository variacaoRepository;
    private final EnderecoRepository enderecoRepository;
    private final PagamentoRepository pagamentoRepository;
    private final PedidoEventProducer pedidoEventProducer;

    public PedidoService(PedidoRepository pedidoRepository, UsuarioRepository usuarioRepository, VariacaoRepository variacaoRepository, EnderecoRepository enderecoRepository, PagamentoRepository pagamentoRepository, PedidoEventProducer pedidoEventProducer) {
        this.pedidoRepository = pedidoRepository;
        this.usuarioRepository = usuarioRepository;
        this.variacaoRepository = variacaoRepository;
        this.enderecoRepository = enderecoRepository;
        this.pagamentoRepository = pagamentoRepository;
        this.pedidoEventProducer = pedidoEventProducer;
    }

    @Transactional
    public CheckoutResponseDTO realizarCheckout(CheckoutRequestDTO dto) {
        Usuario usuario = usuarioRepository.findById(dto.usuarioId())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Endereco endereco = new Endereco();
        endereco.setCep(dto.endereco().cep());
        endereco.setRua(dto.endereco().rua());
        endereco.setNumero(dto.endereco().numero());
        endereco.setComplemento(dto.endereco().complemento());
        endereco.setBairro(dto.endereco().bairro());
        endereco.setCidade(dto.endereco().cidade());
        endereco.setEstado(dto.endereco().estado());
        endereco.setUsuario(usuario);
        enderecoRepository.save(endereco);

        Pedido pedido = new Pedido();
        pedido.setUsuario(usuario);
        pedido.setEnderecoEntrega(endereco);
        pedido.setDataPedido(LocalDateTime.now());
        pedido.setStatus("AGUARDANDO_PAGAMENTO");

        BigDecimal valorTotal = BigDecimal.ZERO;

        for (ItemCompraDTO itemDto : dto.itens()) {
            Variacao variacao = variacaoRepository.findById(itemDto.variacaoId())
                    .orElseThrow(() -> new RuntimeException("Variação não encontrada"));

            if (variacao.getQuantidadeEstoque() < itemDto.quantidade()) {
                throw new RuntimeException("Estoque insuficiente para o produto: " + variacao.getProduto().getNome());
            }

            variacao.setQuantidadeEstoque(variacao.getQuantidadeEstoque() - itemDto.quantidade());
            variacaoRepository.save(variacao);

            ItemPedido itemPedido = new ItemPedido();
            itemPedido.setVariacao(variacao);
            itemPedido.setQuantidade(itemDto.quantidade());
            itemPedido.setPrecoUnitario(variacao.getProduto().getPrecoBase());

            pedido.adicionarItem(itemPedido);

            BigDecimal subtotal = itemPedido.getPrecoUnitario().multiply(BigDecimal.valueOf(itemPedido.getQuantidade()));
            valorTotal = valorTotal.add(subtotal);
        }

        pedido.setValorTotal(valorTotal);

        Pagamento pagamento = new Pagamento();
        pagamento.setCodigoPix("PIX-" + UUID.randomUUID().toString());
        pagamento.setStatus("PENDENTE");
        pagamento.setDataExpiracao(LocalDateTime.now().plusMinutes(30));

        pedido.definirPagamento(pagamento);

        Pedido pedidoSalvo = pedidoRepository.save(pedido);

        return new CheckoutResponseDTO(
                pedidoSalvo.getId(),
                pedidoSalvo.getValorTotal(),
                pedidoSalvo.getStatus(),
                pedidoSalvo.getPagamento().getCodigoPix()
        );
    }
    @Transactional
    public void processarPagamentoPix(WebhookPixDTO dto) {
        Pagamento pagamento = pagamentoRepository.findByCodigoPix(dto.codigoPix())
                .orElseThrow(() -> new RuntimeException("Pagamento não encontrado"));

        if (pagamento.getStatus().equals("PAGO")) {
            throw new RuntimeException("Este pagamento já foi processado.");
        }

        if (dto.statusPagamento().equalsIgnoreCase("APROVADO")) {
            pagamento.setStatus("PAGO");
            pagamento.setDataPagamento(LocalDateTime.now());

            // O pedido é a raiz, atualizamos ele também
            pagamento.getPedido().setStatus("PAGO");

            pedidoEventProducer.enviarPedidoPago(new PedidoPagoEvent(pagamento.getPedido().getId()));

        } else if (dto.statusPagamento().equalsIgnoreCase("RECUSADO")) {
            pagamento.setStatus("RECUSADO");
            pagamento.getPedido().setStatus("CANCELADO");

            for (ItemPedido item : pagamento.getPedido().getItens()) {
                Variacao variacao = item.getVariacao();
                variacao.setQuantidadeEstoque(variacao.getQuantidadeEstoque() + item.getQuantidade());
                variacaoRepository.save(variacao);
            }

        }

        pagamentoRepository.save(pagamento);
    }

    public List<PedidoHistoricoDTO> buscarMeusPedidos(Usuario usuarioLogado) {
        return pedidoRepository.findByUsuario(usuarioLogado)
                .stream()
                .map(pedido -> new PedidoHistoricoDTO(
                        pedido.getId(),
                        pedido.getValorTotal(),
                        pedido.getStatus()
                ))
                .toList(); // O .toList() é nativo e recomendado no Java 16+
    }

    public PedidoDetalheDTO buscarDetalhesPedido(Long pedidoId, Usuario usuarioLogado) {
        Pedido pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));

        // Proteção: Garante que o cliente só veja o próprio pedido
        if (!pedido.getUsuario().getId().equals(usuarioLogado.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Acesso negado a este pedido");
        }

        // Mapeia os itens puxando os dados da Variação e do Produto
        List<ItemPedidoDTO> itensDTO = pedido.getItens().stream()
                .map(item -> new ItemPedidoDTO(
                        item.getVariacao().getProduto().getId(),
                        item.getVariacao().getProduto().getNome(),
                        item.getVariacao().getTamanho(),
                        item.getVariacao().getCor(),
                        item.getQuantidade(),
                        item.getPrecoUnitario()
                )).toList();

        // Formata o endereço resumido
        String enderecoFormatado = pedido.getEnderecoEntrega().getRua() + ", " + pedido.getEnderecoEntrega().getNumero();

        return new PedidoDetalheDTO(
                pedido.getId(),
                pedido.getStatus(),
                pedido.getValorTotal(),
                enderecoFormatado,
                itensDTO
        );
    }
}