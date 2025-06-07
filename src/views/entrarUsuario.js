import React, {useContext, useEffect, useState} from "react";
import UsuarioService, {usuarioPrototype} from "../app/service/usuarioService";
import {useNavigate} from "react-router-dom";
import Form from "react-bootstrap/Form";
import {Button} from "react-bootstrap";
import {AuthContext} from "../main/provedorAutenticacao";
import {mensagemErro, mensagemSucesso} from "../components/toastr";

export default function EntrarUsuario() {

  const [autenticacaoRequestDTO, setAutenticacaoRequestDTO] = useState({email: '', senha: '', codigoSegundoFator: ''});

  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const service = new UsuarioService();

  const [exibirSegundoFator, setExibirSegundoFator] = useState(false);

  useEffect(() => {
    document.title = 'Reportaí - Login';
  }, []);

  /**
   * Valida se os campos obrigatórios estão preenchidos e chama o serviço de autenticação.
   */
  const entrar = () => {

    console.log(autenticacaoRequestDTO);
    if (!autenticacaoRequestDTO.email) {
      mensagemErro('O campo email é obrigatório.')
      return;
    }
    if (!autenticacaoRequestDTO.senha) {
      mensagemErro('O campo senha é obrigatório.')
      return;
    }
    if (exibirSegundoFator && !autenticacaoRequestDTO.codigoSegundoFator) {
      mensagemErro('O campo código de verificação é obrigatório.')
      return;
    }

    service
      .autenticar(autenticacaoRequestDTO)
      .then(response => {
        const tokenDTO = response.data;
        if (tokenDTO.status === 'AGUARDANDO_SEGUNDO_FATOR') {
          setExibirSegundoFator(true);
          return;
        }
        if (tokenDTO.status === 'OK') {
          mensagemSucesso('Bem vindo!');
          authContext.iniciarSessao(response.data)
          navigate("/")
        }
         
      })
      .catch(error => {
        mensagemErro(error?.response?.data?.descricao ?? 'Erro ao fazer login')
      })
  }

  return (
    <div className='container'>


      {
        exibirSegundoFator &&
        <div className="row mt-5 d-flex justify-content-center">

          {/*titulo*/}
          <div className="col-12 d-flex justify-content-center">
            <h2> Informe o código de verificação</h2>
          </div>

          <div className="col-12 ">
            <p className="text-center mb-0 mt-2">Um código de verificação foi enviado para o seu email. </p>
            <p className="text-center mt-0"> Por favor, insira o código abaixo para continuar.</p>
          </div>


          {/*form*/}
          <div className="col-lg-6 mt-3">
            <Form>

              {/*código de verificação*/}
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Digite o código de verificação"
                  maxLength={6}
                  onChange={event => setAutenticacaoRequestDTO({...autenticacaoRequestDTO, codigoSegundoFator: event.target.value})}
                />
              </Form.Group>

              {/*botão*/}
              <div className="d-flex gap-2 flex-column align-items-center">
                <Button className="mt-3" variant="warning" onClick={() => entrar()}> Verificar </Button>
                <div onClick={() => window.location.reload()} className='link'>Voltar</div>
              </div>

            </Form>
          </div>
        </div>
      }


      {
        !exibirSegundoFator &&
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
                  value={autenticacaoRequestDTO.email}
                  onChange={event => setAutenticacaoRequestDTO({...autenticacaoRequestDTO, email: event.target.value})}/>
              </Form.Group>

              {/*senha*/}
              <Form.Group className="mb-3">
                <Form.Label>Senha</Form.Label>
                <Form.Control
                  type="password"
                  maxLength={255}
                  placeholder="Crie uma senha"
                  value={autenticacaoRequestDTO.senha}
                  onChange={event => setAutenticacaoRequestDTO({...autenticacaoRequestDTO, senha: event.target.value})}/>
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
      }

    </div>
  )


}