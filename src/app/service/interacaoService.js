import ApiService from "./apiService";

export class InteracaoService extends ApiService {
  constructor() {
    super('/interacoes');
  }

  consultarRegistroSimples(registroId) {
    return this.get(`/${registroId}`);
  }

  interagir(interacao) {
    return this.post('', interacao);
  }

  removerInteracao(registroId) {
    return this.delete(`/${registroId}`);
  }

}