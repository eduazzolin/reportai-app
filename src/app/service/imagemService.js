import ApiService from "./apiService";
import ErroValidacao from "../exception/erroValidacao";

export class ImagemService extends ApiService {
  constructor() {
    super('/imagens');
  }

  salvar(formData) {
    for (let par of formData.entries()) {
      console.log(par[0], par[1]);
    }
    return this.post('', formData);
  }

  remover(id) {
    return this.delete(`/${id}`);
  }

  validar(listaImagens) {
    const erros = []

    for (let imagem of listaImagens) {

      if (!imagem) {
        continue
      }

      // formato
      if (imagem.type !== 'image/png' && imagem.type !== 'image/jpeg') {
        erros.push("O formato da imagem deve ser PNG ou JPEG.")
      }

      // tamanho
      if (imagem.size > 1024 * 1024 * 10) {
        erros.push("A imagem deve ter no máximo 10MB.")
      }
    }

    // lançando erros
    if (erros && erros.length > 0) {
      throw new ErroValidacao(erros);
    }
  }

  comprimirImagem(imagem) {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(blob => resolve(blob), 'image/jpeg', 0.5);
      };

      img.onerror = (error) => reject(error);
      img.src = URL.createObjectURL(imagem);
    });
  }

}


export const imagemPrototype = {
  "id": null,
  "caminho": "",
  "idRegistro": null,
  "file": null
}