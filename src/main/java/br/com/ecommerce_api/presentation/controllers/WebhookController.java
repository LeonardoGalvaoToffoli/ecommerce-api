package br.com.ecommerce_api.presentation.controllers;

import br.com.ecommerce_api.application.dtos.WebhookPixDTO;
import br.com.ecommerce_api.application.services.PedidoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/webhooks")
public class WebhookController {

    private final PedidoService pedidoService;

    public WebhookController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    @PostMapping("/pix")
    public ResponseEntity<Void> receberConfirmacaoPix(@Valid @RequestBody WebhookPixDTO dto) {
        pedidoService.processarPagamentoPix(dto);
        return ResponseEntity.ok().build(); // Retorna 200 OK sem corpo, padrão para webhooks
    }
}