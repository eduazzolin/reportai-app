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
    usuario.senha = this.hashSenha(usuario.senha);
    return this.post('', usuario);
  }

  deletar(id) {
    return this.delete(`/${id}`);
  }

  buscarTodos(pagina, limite, termo) {
    termo = termo || '';
    return this.get('/admin?pagina=' + pagina + '&limite=' + limite + '&termo=' + termo);
  }

  validar(usuario, isEdicao = false) {
    const erros = []

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

    // senha
    if(!isEdicao) {
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

    // cpf
    if (!usuario.cpf) {
      erros.push("O campo CPF é obrigatório.");
    } else if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(usuario.cpf)) {
      erros.push("Informe um CPF válido.");
    }

    // lançando erros
    if (erros && erros.length > 0) {
      throw new ErroValidacao(erros);
    }

  }

  autenticar(credenciais) {
    credenciais.senha = this.hashSenha(credenciais.senha);
    return this.post('/autenticar', credenciais)
  }
}