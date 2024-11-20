package com.reportai.reportaiserver.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {

   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id;
   private String nome;
   @Column(unique = true)
   private String email;
   @Column(unique = true)
   private String cpf;
   private String senha;
   private LocalDateTime dataCriacao;
   private boolean isDeleted;

}