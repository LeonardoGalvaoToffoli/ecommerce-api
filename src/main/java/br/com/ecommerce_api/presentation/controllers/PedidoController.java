package br.com.ecommerce_api.presentation.controllers;

import br.com.ecommerce_api.application.dtos.CheckoutRequestDTO;
import br.com.ecommerce_api.application.dtos.CheckoutResponseDTO;
import br.com.ecommerce_api.application.dtos.PedidoDetalheDTO;
import br.com.ecommerce_api.application.services.PedidoService;
import br.com.ecommerce_api.domain.entities.Usuario;
import br.com.ecommerce_api.application.dtos.PedidoHistoricoDTO;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    private final PedidoService service;

    public PedidoController(PedidoService service) {
        this.service = service;
    }

    @PostMapping("/checkout")
    public ResponseEntity<CheckoutResponseDTO> realizarCheckout(@Valid @RequestBody CheckoutRequestDTO dto) {
        CheckoutResponseDTO response = service.realizarCheckout(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/meus-pedidos")
    public ResponseEntity<List<PedidoHistoricoDTO>> listarMeusPedidos(@AuthenticationPrincipal Usuario usuarioLogado) {
        List<PedidoHistoricoDTO> pedidos = service.buscarMeusPedidos(usuarioLogado);
        return ResponseEntity.ok(pedidos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PedidoDetalheDTO> buscarDetalhes(@PathVariable Long id, @AuthenticationPrincipal Usuario usuarioLogado) {
        PedidoDetalheDTO detalhes = service.buscarDetalhesPedido(id, usuarioLogado);
        return ResponseEntity.ok(detalhes);
    }
}