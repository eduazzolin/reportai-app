package com.reportai.reportaiserver.repository;

import com.reportai.reportaiserver.model.Registro;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RegistroRepository extends JpaRepository<Registro, Long> {
}
