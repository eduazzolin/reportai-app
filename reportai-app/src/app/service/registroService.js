import ApiService from "./apiService";

export class RegistroService extends ApiService {
  constructor() {
    super('/registros');
  }

  consultar(latitude, longitude, distancia) {
    let url = `/distancia?latitude=${latitude}&longitude=${longitude}`;
    if (distancia) {
      url += `&distancia=${distancia}`;
    }
    url += `&pagina=1`;
    return this.get(url);
  }


}