package com.reportai.reportaiserver.service;

import com.reportai.reportaiserver.model.Registro;
import com.reportai.reportaiserver.repository.RegistroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RegistroService {

   @Autowired
   private RegistroRepository repository;

   public Registro save(Registro registro) {
      return repository.save(registro);
   }

   public Registro findById(Long id) {
      return repository.findById(id).orElse(null);
   }

   public List<Registro> findAll() {
      List<Registro> registros = repository.findAll();
      return orderByProximity(registros, -27.66674533163343, -48.48246553064851);
   }

   public void deleteById(Long id) {
      repository.deleteById(id);
   }

   private List<Registro> orderByProximity(List<Registro> registros, double latitude, double longitude) {
      registros.sort((r1, r2) -> {
         double distance1 = Math.sqrt(Math.pow(r1.getLatitude() - latitude, 2) + Math.pow(r1.getLongitude() - longitude, 2));
         double distance2 = Math.sqrt(Math.pow(r2.getLatitude() - latitude, 2) + Math.pow(r2.getLongitude() - longitude, 2));
         return Double.compare(distance1, distance2);
      });
      return registros;
   }
}
