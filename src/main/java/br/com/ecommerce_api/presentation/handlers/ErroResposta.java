package br.com.ecommerce_api.presentation.handlers;

import java.time.LocalDateTime;
import java.util.List;

public record ErroResposta(
        LocalDateTime timestamp,
        Integer status,
        String erro,
        String caminho,
        List<CampoErro> errosValidacao
) {
}