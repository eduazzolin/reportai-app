package com.reportai.reportaiserver.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

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

   @Column(precision = 10)
   private Double latitude;

   @Column(precision = 11)
   private Double longitude;

   @CreationTimestamp
   @Column(updatable = false)
   private LocalDateTime dtCriacao;

   @UpdateTimestamp
   @Column()
   private LocalDateTime dtModificacao;

   @Column()
   private Boolean isConcluido = false;

   @Column()
   private Boolean isDeleted = false;

   @ManyToOne
   @JoinColumn(nullable = false)
   private Categoria categoria;

   @ManyToOne
   @JoinColumn(name = "id_usuario", nullable = false)
   private Usuario usuario;

}