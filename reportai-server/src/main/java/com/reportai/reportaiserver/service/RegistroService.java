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
      return ordenarPorProximidade(registros, -27.66674533163343, -48.48246553064851);
   }

   public void deleteById(Long id) {
      repository.deleteById(id);
   }

   /***
    * Ordena os registros por proximidade com a latitude e longitude informadas.
    * A ordenação é feita primeiramente pela distância entre a localização do registro e a localização informada.
    * A distância é arredondada para o próximo múltiplo de 4km.
    * Caso a distância arrendondada seja a mesma, a ordenação é feita pela data de criação do registro.
    * @param registros
    * @param latitude
    * @param longitude
    * @return
    */
   public List<Registro> ordenarPorProximidade(List<Registro> registros, double latitude, double longitude) {
      registros.sort((r1, r2) -> {
         double distancia1 = arredondarParaProximoMultiploDe4Km(
                 calcularDistancia(r1.getLatitude(), r1.getLongitude(), latitude, longitude)
         );
         double distancia2 = arredondarParaProximoMultiploDe4Km(
                 calcularDistancia(r2.getLatitude(), r2.getLongitude(), latitude, longitude)
         );

         int comparacaoDistancia = Double.compare(distancia1, distancia2);
         if (comparacaoDistancia != 0) {
            return comparacaoDistancia;
         }

         return r2.getDtCriacao().compareTo(r1.getDtCriacao());
      });

      return registros;
   }

   private double calcularDistancia(double lat1, double lon1, double lat2, double lon2) {
      // https://pt.stackoverflow.com/questions/310350/dist%C3%A2ncia-entre-dois-pontos
      // Euclidiana
      double powLong = Math.pow(lon2 - lon1, 2);
      double powLat = Math.pow(lat2 - lat1, 2);
      return Math.sqrt(powLong + powLat) * 100;
   }

   private double arredondarParaProximoMultiploDe4Km(double distancia) {
      return Math.round(distancia / 4) * 4;
   }

}
