import React from "react";
import AuthService from "../app/service/authService";

export const AuthContext = React.createContext();
const AuthProvider = AuthContext.Provider;


function ProvedorAutenticacao(props) {

  const [usuarioAutenticado, setUsuarioAutenticado] = React.useState(() => {if (AuthService.isUsuarioAutenticado()) return AuthService.refreshSession();return null;});
  const [isAutenticado, setIsAutenticado] = React.useState(AuthService.isUsuarioAutenticado());
  const [isAdmin, setIsAdmin] = React.useState(AuthService.isUsuarioAdmin());


  /**
   * Recebe um tokenDTO com o token e o usuario e chama o AuthService para logar o usuario,
   * o que significa armazenar o token e o usuario no localStorage.
   * @param tokenDTO
   */
  const iniciarSessao = (tokenDTO) => {
    const token = tokenDTO.token;
    const usuario = {nome: tokenDTO.nomeUsuario, id: tokenDTO.id}
    AuthService.logar(usuario, token);
    setIsAdmin(AuthService.isUsuarioAdmin);
    setIsAutenticado(true);
    setUsuarioAutenticado(usuario);
  }

  /**
   * Remove o usuario do localStorage e atualiza o estado do usuarioAutenticado e isAutenticado.
   */
  const encerrarSessao = () => {
    AuthService.removerUsuarioAutenticado();
    setUsuarioAutenticado(null);
    setIsAutenticado(false);
    setIsAdmin(false);
    console.log('--- sessão encerrada ---')
  }

  const contexto = {
    usuarioAutenticado: usuarioAutenticado,
    isAutenticado: isAutenticado,
    isAdmin: isAdmin,
    iniciarSessao: iniciarSessao,
    encerrarSessao: encerrarSessao
  }

  return (
    <AuthProvider value={contexto}>
      {props.children}
    </AuthProvider>
  );
}

export default ProvedorAutenticacao;