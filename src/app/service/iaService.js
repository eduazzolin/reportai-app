import ApiService from "./apiService";
import MD5 from "crypto-js/md5";
import ErroValidacao from "../exception/erroValidacao";

export const respostaCorrecaoPrototype = {"valido":false, "texto_corrigido": ""}

export default class IaService extends ApiService {
  constructor() {
    super('/ia');
  }

  corrigir(texto) {
    return this.post('/correcao', {texto})
  }
}