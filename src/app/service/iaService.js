import ApiService from "./apiService";

export const respostaCorrecaoPrototype = {"valido": false, "texto_corrigido": ""}

export default class IaService extends ApiService {
  constructor() {
    super('/ia');
  }

  corrigir(texto) {
    return this.post('/correcao', {texto})
  }
}