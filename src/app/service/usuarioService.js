import ApiService from "./apiService";
import MD5 from "crypto-js/md5";
import ErroValidacao from "../exception/erroValidacao";

export const usuarioPrototype = {
  "id": null,
  "cpf": "",
  "dt_criacao": null,
  "dt_mofidicacao": null,
  "email": "",
  "is_deleted": false,
  "nome": "",
  "role": "USUARIO",
  "senha": "",
}

export default class UsuarioService extends ApiService {
  constructor() {
    super('/usuarios');
  }

  buscarDTOPorId(id) {
    return this.get(`/${id}`);
  }

  hashSenha(senha) {
    return MD5(senha).toString();
  }

  salvar(usuario) {
    if (usuario.senha) {
      usuario.senha = this.hashSenha(usuario.senha);
    }
    return this.post('', usuario);
  }

  deletar(id) {
    return this.delete(`/${id}`);
  }

  buscarTodos(pagina, limite, termo, ordenacao) {
    termo = termo || '';
    return this.get('/admin?pagina=' + pagina + '&limite=' + limite + '&termo=' + termo + '&ordenacao=' + ordenacao);
  }

  /**
   * Valida os campos do usuário de acordo com o modo.
   * @param usuario Objeto com os dados do usuário
   * @param modo ['completo', 'senha', 'exceto-senha']
   */
  validar(usuario, modo = 'completo') {
    const erros = []

    if (modo === 'completo' || modo === 'exceto-senha') {

      // nome
      if (!usuario.nome) {
        erros.push("O campo nome é obrigatório.")
      } else if (usuario.nome.length > 255) {
        erros.push("O campo nome deve ter no máximo 255 caracteres.")
      }

      // email
      if (!usuario.email) {
        erros.push("O campo email é obrigatório.")
      } else if (!usuario.email.match(/^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/)) {
        erros.push("Informe um email válido.")
      }

      // cpf
      if (!usuario.cpf) {
        erros.push("O campo CPF é obrigatório.");
      } else if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(usuario.cpf)) {
        erros.push("Informe um CPF válido.");
      }

    }

    if (modo === 'completo' || modo === 'senha') {

      // senha
      if (!usuario.senha || !usuario.senhaRepeticao) {
        erros.push("O campo senha é obrigatório.")
      } else if (usuario.senha.length < 6) {
        erros.push("A senha deve ter pelo menos 6 caracteres.")
      } else if (usuario.senha.length > 255) {
        erros.push("A senha deve ter no máximo 255 caracteres.")
      } else if (usuario.senha !== usuario.senhaRepeticao) {
        erros.push("As senhas devem ser iguais.")
      }

    }

    // lançando erros
    if (erros && erros.length > 0) {
      throw new ErroValidacao(erros);
    }

  }

  autenticar(cred) {
    const credenciais = {
      email: cred.email,
      senha: this.hashSenha(cred.senha),
      codigoSegundoFator: cred.codigoSegundoFator || null
    }
    return this.post('/autenticar', credenciais)
  }

  alterarSenha(usuario) {
    usuario.senha = this.hashSenha(usuario.senha);
    return this.post('/alterar-senha', usuario);
  }

  recuperarSenha(usuario) {
    return this.post('/recuperar-senha', usuario);
  }

  alterarSenhaToken(usuario, token) {
    const tokenSenhaDTO = {
      email: usuario.email,
      senha: this.hashSenha(usuario.senha),
      token: token
    }
    return this.post('/alterar-senha-token', tokenSenhaDTO);
  }
}