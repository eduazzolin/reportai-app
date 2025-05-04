import LocalStorageService from "./localStorageService";
import {jwtDecode} from "jwt-decode";
import {mensagemAlerta} from "../../components/toastr";

export const USUARIO_LOGADO = 'usuario_logado';
export const TOKEN = 'access_token';

export default class AuthService {

  /**
   * Verifica se o usuário está autenticado e se o token não expirou.
   * Se o token estiver expirado, remove o usuário autenticado.
   *
   * @returns {boolean} true se o usuário estiver autenticado, false caso contrário.
   */
  static isUsuarioAutenticado() {
    const token = LocalStorageService.obterItem(TOKEN);

    if (!token) {
      return false;
    }

    const tokenLido = jwtDecode(token);
    const expiracao = tokenLido.exp;
    const agora = new Date().getTime();

    if (agora > expiracao * 1000) {
      mensagemAlerta("Sua sessão expirou, faça login novamente.");
      AuthService.removerUsuarioAutenticado();
      return false;
    } else {
      return true
    }

  }

  /**
   * Verifica se o usuário é um administrador.
   * @returns {boolean}
   */
  static isUsuarioAdmin() {
    if(AuthService.isUsuarioAutenticado()) {
      const token = LocalStorageService.obterItem(TOKEN);
      const decoded = jwtDecode(token);
      const role = decoded.role;
      return role === 'ADMIN';
    } else {
      return false;
    }
  }

  /**
   * Remove o usuário autenticado do localStorage.
   */
  static removerUsuarioAutenticado() {
    LocalStorageService.removerItem(USUARIO_LOGADO);
    LocalStorageService.removerItem(TOKEN);
  }

  /**
   * Armazena o usuário e o token no localStorage.
   * @param usuario id e nome
   * @param token token JWT
   */
  static logar(usuario, token) {
    LocalStorageService.adicionarItem(USUARIO_LOGADO, usuario);
    LocalStorageService.adicionarItem(TOKEN, token);
  }

  /**
   * Retorna o usuário autenticado do localStorage.
   * @returns {id: number, nome: string}
   */
  static obterUsuarioAutenticado() {
    return LocalStorageService.obterItem(USUARIO_LOGADO);
  }
}