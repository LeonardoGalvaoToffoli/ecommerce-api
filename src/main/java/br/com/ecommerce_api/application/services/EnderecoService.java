package br.com.ecommerce_api.application.services;

import br.com.ecommerce_api.application.dtos.EnderecoRequestDTO;
import br.com.ecommerce_api.application.dtos.EnderecoResponseDTO;
import br.com.ecommerce_api.domain.entities.Endereco;
import br.com.ecommerce_api.domain.entities.Usuario;
import br.com.ecommerce_api.infrastructure.repositories.EnderecoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class EnderecoService {

    private final EnderecoRepository repository;

    public EnderecoService(EnderecoRepository repository) {
        this.repository = repository;
    }

    public List<EnderecoResponseDTO> listarMeusEnderecos(Usuario usuarioLogado) {
        return repository.findByUsuario(usuarioLogado).stream()
                .map(EnderecoResponseDTO::new)
                .toList();
    }

    public EnderecoResponseDTO adicionarEndereco(Usuario usuarioLogado, EnderecoRequestDTO dto) {
        Endereco endereco = new Endereco();
        preencherEndereco(endereco, dto);
        endereco.setUsuario(usuarioLogado);

        endereco = repository.save(endereco);
        return new EnderecoResponseDTO(endereco);
    }

    public EnderecoResponseDTO atualizarEndereco(Long enderecoId, Usuario usuarioLogado, EnderecoRequestDTO dto) {
        Endereco endereco = repository.findById(enderecoId)
                .orElseThrow(() -> new RuntimeException("Endereço não encontrado"));


        if (!endereco.getUsuario().getId().equals(usuarioLogado.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Acesso negado a este endereço");
        }

        preencherEndereco(endereco, dto);
        endereco = repository.save(endereco);

        return new EnderecoResponseDTO(endereco);
    }

    private void preencherEndereco(Endereco endereco, EnderecoRequestDTO dto) {
        endereco.setCep(dto.cep());
        endereco.setRua(dto.rua());
        endereco.setNumero(dto.numero());
        endereco.setComplemento(dto.complemento());
        endereco.setBairro(dto.bairro());
        endereco.setCidade(dto.cidade());
        endereco.setEstado(dto.estado());
    }
}