import ApiService from "./apiService";

export class ImagemService extends ApiService {
  constructor() {
    super('/imagens');
  }

  salvar(formData) {
    return this.post('', formData);
  }


}

export const imagemPrototype = {
  "id": null,
  "caminho": "",
  "idRegistro": null,
  "file": null
}