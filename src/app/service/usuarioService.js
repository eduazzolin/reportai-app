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

  /**
   * Busca um usuário pelo ID e retorna um DTO com os dados do usuário.
   *
   * @param id
   * @returns UsuarioDTO
   */
  buscarDTOPorId(id) {
    return this.get(`/${id}`);
  }

  /**
   * Gera um hash MD5 da senha do usuário.
   *
   * @param senha
   * @returns string
   */
  hashSenha(senha) {
    return MD5(senha).toString();
  }

  /**
   * Salva um usuário no banco de dados.
   *
   * @param usuario
   * @returns UsuarioDTO
   */
  salvar(usuario) {
    if (usuario.senha) {
      usuario.senha = this.hashSenha(usuario.senha);
    }
    return this.post('', usuario);
  }

  /**
   * Remove um usuário do banco de dados.
   *
   * @param id
   */
  deletar(id) {
    return this.delete(`/${id}`);
  }

  /**
   * Busca todos os usuários com paginação, filtro por termo, ID do usuário e ordenação.
   * Usado na tela Admin.
   *
   * @param pagina
   * @param limite
   * @param termo
   * @param id_usuario
   * @param ordenacao
   */
  buscarTodos(pagina, limite, termo, id_usuario, ordenacao) {
    termo = termo || '';
    id_usuario = id_usuario || '';
    return this.get('/admin?pagina=' + pagina + '&limite=' + limite + '&termo=' + termo + '&id_usuario=' + id_usuario + '&ordenacao=' + ordenacao);
  }

  /**
   * Valida os campos do usuário conforme o modo.
   *
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

  /**
   * Autentica um usuário com email, senha e código de segundo fator (opcional).
   *
   * @param cred: objeto com email, senha e código de segundo fator
   */
  autenticar(cred) {
    const credenciais = {
      email: cred.email,
      senha: this.hashSenha(cred.senha),
      codigoSegundoFator: cred.codigoSegundoFator || null
    }
    return this.post('/autenticar', credenciais)
  }

  /**
   * Altera a senha do usuário autenticado.
   *
   * @param usuario
   */
  alterarSenha(usuario) {
    usuario.senha = this.hashSenha(usuario.senha);
    return this.post('/alterar-senha', usuario);
  }

  /**
   * Inicia o processo de recuperação de senha para o usuário.
   *
   * @param usuario
   */
  recuperarSenha(usuario) {
    return this.post('/recuperar-senha', usuario);
  }

  /**
   * Altera a senha do usuário usando um token de recuperação.
   *
   * @param usuario
   * @param token
   */
  alterarSenhaToken(usuario, token) {
    const tokenSenhaDTO = {
      email: usuario.email,
      senha: this.hashSenha(usuario.senha),
      token: token
    }
    return this.post('/alterar-senha-token', tokenSenhaDTO);
  }
}