import ApiService from "./apiService";

export class CategoriaService extends ApiService {
  constructor() {
    super('/categorias');
  }

  consultar() {
    return this.get('');
  }

}


export const categoriaPrototype = {
  "id": null,
  "nome": "",
  "icone": "",
  "dtCriacao": null,
  "dtModificacao": null,
  "isDeleted": false
}
