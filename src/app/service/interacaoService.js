import ApiService from "./apiService";

export class InteracaoService extends ApiService {
  constructor() {
    super('/interacoes');
  }

  /**
   * Consulta interações de um registro específico para o usuário logado.
   *
   * @param registroId
   */
  consultarRegistroSimples(registroId) {
    return this.get(`/${registroId}`);
  }

  /**
   * Cria uma nova interação para o registro.
   *
   * @param interacao
   */
  interagir(interacao) {
    return this.post('', interacao);
  }

  /**
   * Remove uma interação específica do registro.
   *
   * @param registroId
   */
  removerInteracao(registroId) {
    return this.delete(`/${registroId}`);
  }

  /**
   * Busca as interações relevantes de um registro específico.
   *
   * @param registroId
   */
  buscarRelevantes(registroId) {
    return this.get(`/relevantes/${registroId}`);
  }

}