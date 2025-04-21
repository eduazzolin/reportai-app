import ApiService from "./apiService";

export class RelatorioService extends ApiService {
  constructor() {
    super('/relatorio-publico');
  }

  gerarRelatorioBairros(dataInicio, dataFim) {
    let url = '/bairro';
    if (dataInicio && dataFim) {
      url = (`${url}?dataInicio=${dataInicio}&dataFim=${dataFim}`);
    }
    console.log(url)
    return this.get(url);
  }

  gerarRelatorioCategorias(dataInicio, dataFim) {
    let url = '/categoria';
    if (dataInicio && dataFim) {
      url = (`${url}?dataInicio=${dataInicio}&dataFim=${dataFim}`);
    }
    return this.get(url);
  }

  gerarRelatorioStatus(dataInicio, dataFim) {
    let url = '/status';
    if (dataInicio && dataFim) {
      url = (`${url}?dataInicio=${dataInicio}&dataFim=${dataFim}`);
    }
    return this.get(url);
  }

}