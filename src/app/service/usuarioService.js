import ApiService from "./apiService";
import MD5 from "crypto-js/md5";

export const usuarioPrototype = {
  "id": null,
  "cpf": "",
  "dt_criacao": null,
  "dt_mofidicacao": null,
  "email": "",
  "is_deleted": false,
  "nome": "",
  "role": "",
  "senha": "",
}

export default class UsuarioService extends ApiService {
  constructor() {
    super('/usuarios');
  }

  hashSenha(senha) {
    return MD5(senha).toString();
  }

  salvar(usuario) {
    usuario.senha = this.hashSenha(usuario.senha);
    return this.post('', usuario);
  }

}