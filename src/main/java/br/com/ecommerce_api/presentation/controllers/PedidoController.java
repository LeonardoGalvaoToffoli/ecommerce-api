package br.com.ecommerce_api.presentation.controllers;

import br.com.ecommerce_api.application.dtos.CheckoutRequestDTO;
import br.com.ecommerce_api.application.dtos.CheckoutResponseDTO;
import br.com.ecommerce_api.application.services.PedidoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}