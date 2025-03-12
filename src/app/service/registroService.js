import ApiService from "./apiService";
import {categoriaPrototype} from "./categoriaService";
import {COORDENADAS_CENTRO} from "./appService";

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

  calcularDistanciaDoCentro(lat, lon) {
    const diferencaLat = COORDENADAS_CENTRO[0] - lat;
    const diferencaLong = COORDENADAS_CENTRO[1] - lon;
    return Math.sqrt(Math.pow(diferencaLat, 2) + Math.pow(diferencaLong, 2)) * 100;
  }

  salvar(registro) {
    return this.post('', registro);
  }
}

export const registroPrototype = {
  "id": null,
  "titulo": "",
  "descricao": "",
  "localizacao": "",
  "latitude": null,
  "longitude": null,
  "dtCriacao": null,
  "dtModificacao": null,
  "isConcluido": false,
  "isDeleted": false,
  "categoria": categoriaPrototype,
  "imagens": [],
  "usuario": {
    "id": null,
    "nome": ""
  },
  "interacoesRelevante": 0,
  "interacoesConcluido": 0
}