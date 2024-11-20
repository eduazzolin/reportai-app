package com.reportai.reportaiserver.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Imagem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(length = 255)
    private String nome;

    @Lob
    @Column
    private String caminho;

    @ManyToOne
    @JoinColumn(name = "id_registro", nullable = false)
    private Registro registro;
}
