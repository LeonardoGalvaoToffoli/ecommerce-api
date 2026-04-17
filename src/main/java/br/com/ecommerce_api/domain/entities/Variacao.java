package br.com.ecommerce_api.domain.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "variacoes")
@Getter
@Setter
@NoArgsConstructor
public class Variacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String tamanho;

    private String cor;

    private Integer quantidadeEstoque;

    @ManyToOne
    @JoinColumn(name = "produto_id")
    private Produto produto;
}