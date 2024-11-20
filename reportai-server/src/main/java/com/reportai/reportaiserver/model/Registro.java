package com.reportai.reportaiserver.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Registro {

   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Integer id;

   @Column(nullable = false, length = 255)
   private String titulo;

   @Lob
   @Column(nullable = false, length = 1000)
   private String descricao;

   @Column(length = 255)
   private String localizacao;

   @Column(precision = 10, scale = 8)
   private BigDecimal latitude;

   @Column(precision = 11, scale = 8)
   private BigDecimal longitude;

   @CreationTimestamp
   @Column(updatable = false)
   private LocalDateTime dtCriacao;

   @UpdateTimestamp
   @Column()
   private LocalDateTime dtModificacao;

   @Column(nullable = false)
   private Boolean isConcluido = false;

   @ManyToOne
   @JoinColumn(nullable = false)
   private Categoria categoria;

   @ManyToOne
   @JoinColumn(name = "id_usuario", nullable = false)
   private Usuario usuario;

}