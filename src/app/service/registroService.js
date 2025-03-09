import ApiService from "./apiService";
import {categoriaPrototype} from "./categoriaService";

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