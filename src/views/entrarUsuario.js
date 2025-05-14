import React, {useContext, useEffect, useState} from "react";
import UsuarioService, {usuarioPrototype} from "../app/service/usuarioService";
import {useNavigate} from "react-router-dom";
import Form from "react-bootstrap/Form";
import {Button} from "react-bootstrap";
import {AuthContext} from "../main/provedorAutenticacao";
import {mensagemErro, mensagemSucesso} from "../components/toastr";

export default function EntrarUsuario() {

  const [usuario, setUsuario] = useState(usuarioPrototype);

  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const service = new UsuarioService();

  useEffect(() => {
    document.title = 'Reportaí - Login';
  }, []);

  /**
   * Valida se os campos obrigatórios estão preenchidos e chama o serviço de autenticação.
   */
  const entrar = () => {

    if (!usuario.email) {
      mensagemErro('O campo email é obrigatório.')
      return;
    }
    if (!usuario.senha) {
      mensagemErro('O campo senha é obrigatório.')
      return;
    }

    service
      .autenticar({
        email: usuario.email, senha: usuario.senha
      })
      .then(response => {
        mensagemSucesso('Bem vindo!');
        authContext.iniciarSessao(response.data)
        navigate("/")
      })
      .catch(error => {
        mensagemErro(error?.response?.data?.descricao ?? 'Erro ao fazer login')
      })
  }

  return (
    <div className='container'>
      <div className="row mt-5 d-flex justify-content-center">

        {/*titulo*/}
        <div className="col-12 d-flex justify-content-center">
          <h2>Bem-vindo de volta! 👋</h2>
        </div>

        {/*form*/}
        <div className="col-lg-6 mt-3">
          <Form>

            {/*email*/}
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite seu email"
                maxLength={255}
                value={usuario.email}
                onChange={event => setUsuario({...usuario, email: event.target.value})}/>
            </Form.Group>

            {/*senha*/}
            <Form.Group className="mb-3">
              <Form.Label>Senha</Form.Label>
              <Form.Control
                type="password"
                maxLength={255}
                placeholder="Crie uma senha"
                value={usuario.senha}
                onChange={event => setUsuario({...usuario, senha: event.target.value})}/>
            </Form.Group>

            {/*botão*/}
            <div className="d-flex gap-2 flex-column align-items-center">
              <Button className="mt-3" variant="warning" onClick={() => entrar()}> Entrar </Button>
              <div onClick={() => navigate('/redefinir-senha')} className='link'>Esqueci a senha</div>
              <div onClick={() => navigate('/cadastrar-usuario')} className='link'>Cadastre-se</div>
            </div>

          </Form>
        </div>

      </div>
    </div>
  )


}