import React, {useEffect, useState} from "react";
import {useNavigate, useSearchParams} from 'react-router-dom';
import Form from "react-bootstrap/Form";
import UsuarioService, {usuarioPrototype} from "../app/service/usuarioService";
import {Button} from "react-bootstrap";
import {mensagemErro, mensagemSucesso} from "../components/toastr";


export default function RedefinirSenha() {

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const [usuario, setUsuario] = useState({...usuarioPrototype, email: searchParams.get('email') || ''});
  const [emailEnviado, setEmailEnviado] = useState(false);
  const token = searchParams.get('token') || null;

  const service = new UsuarioService();


  useEffect(() => {
    document.title = 'Reportaí - Redefinir senha';
  }, []);


  const redefinirSenha = () => {
    try {
      service.validar(usuario, 'senha');
    } catch (erro) {
      const msgs = erro.mensagens;
      msgs.forEach(msg => mensagemErro(msg));
      return false;
    }

    service
      .alterarSenhaToken(usuario, token)
      .then(response => {
        mensagemSucesso('Senha alterada com sucesso!');
        navigate('/login');
      })
      .catch(error => {
        mensagemErro(error?.response?.data?.descricao ?? 'Erro ao alterar senha.');
      })
  }

  const enviarEmail = () => {
    service
      .recuperarSenha(usuario)
      .then(response => {
        setEmailEnviado(true);
      }).catch(error => {
      mensagemErro(error?.response?.data?.descricao ?? 'Erro ao enviar email');
    });

  }


  return (
    <div className='container'>
      <div className="row mt-5 d-flex justify-content-center">


        {/*titulo*/}
        <div className="col-12 d-flex justify-content-center">
          <h2>Redefinir Senha</h2>
        </div>

        {/*------------- etapa de envio de email -----------------*/}
        <div className="col-lg-6 mt-3" hidden={token || emailEnviado}>
          <Form>

            {/*email*/}
            <Form.Group className="mb-3 ">
              <Form.Label>Receba um código de confirmação por email</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite seu email"
                value={usuario.email}
                onChange={event => setUsuario({email: event.target.value})}/>
            </Form.Group>

            {/*botão*/}
            <div className='d-flex gap-2 flex-column align-items-center'>
              <Button className="mt-3" variant="warning" onClick={() => enviarEmail()}> Enviar código de confirmação </Button>
            </div>

          </Form>
        </div>

        {/*------------- etapa email enviado -----------------*/}
        <div className="col-lg-6 mt-3" hidden={token || !emailEnviado}>

          <div className="col-12 justify-content-center align-items-center d-flex text-center mt-5">
            ✅ <br/>
            Email enviado com sucesso! <br/>
            Verifique sua caixa de entrada e clique no link para redefinir sua senha. <br/>
          </div>

        </div>


        {/*------------- etapa de troca de senha -----------------*/}
        <div className="col-lg-6 mt-3" hidden={!token}>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Senha</Form.Label>
              <Form.Control
                type="password"
                placeholder="Crie uma senha"
                onChange={event => setUsuario({...usuario, senha: event.target.value})}/>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Repita a senha</Form.Label>
              <Form.Control
                type="password"
                placeholder="Repita a senha, por favor"
                onChange={event => setUsuario({...usuario, senhaRepeticao: event.target.value})}/>
            </Form.Group>

            {/*botão*/}
            <div className='d-flex gap-2'>
              <Button className="mt-3" variant="warning" onClick={() => redefinirSenha()}> Alterar senha </Button>
              <Button className="mt-3" variant="danger" onClick={() => navigate('/login')}> Cancelar </Button>
            </div>
          </Form>
        </div>


      </div>
    </div>


  )
}