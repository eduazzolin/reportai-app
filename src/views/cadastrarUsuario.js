import React, {useEffect, useState} from "react";
import {useNavigate} from 'react-router-dom';
import Form from "react-bootstrap/Form";
import UsuarioService, {usuarioPrototype} from "../app/service/usuarioService";
import {Button, Spinner} from "react-bootstrap";
import {mensagemErro, mensagemSucesso} from "../components/toastr";


export default function CadastrarUsuario() {

  const [usuario, setUsuario] = useState(usuarioPrototype);
  const [checkPrivacidade, setCheckPrivacidade] = useState(false);

  const navigate = useNavigate();
  const service = new UsuarioService();

  useEffect(() => {
    document.title = 'Reportaí - Cadastro de Usuário';
  }, []);

  const cadastrar = () => {


    usuario.role = 'USUARIO';

    try {
      service.validar(usuario, 'completo');
    } catch (erro) {
      const msgs = erro.mensagens;
      msgs.forEach(msg => mensagemErro(msg));
      return false;
    }

    if (checkPrivacidade) {

      service
        .salvar(usuario)
        .then(response => {
          mensagemSucesso('Cadastro realizado com sucesso! Faça o login para acessar o sistema.');
          navigate("/login")
        })
        .catch(error => {
          mensagemErro(error?.response?.data?.descricao ?? 'Erro ao cadastrar usuário')
          setUsuario({...usuario, senha: '', senhaRepeticao: ''})
        })

    } else {
      mensagemErro('Você precisa aceitar a Política de Privacidade para se cadastrar.');
    }

  }

  const mascaraCpf = value => {
    // https://medium.com/reactbrasil/mascara-de-cpf-com-react-javascript-a07719345c93
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1')
  }

  const irParaPoliticaPrivacidade = () => {
    window.open(`/politica-privacidade`, '_blank');
  };

  return (
    <div className='container'>
      <div className="row mt-5">

        {/*titulo*/}
        <div className="col-12 justify-content-center d-flex">
          <h2>Faça parte do Reportaí 👋</h2>
        </div>

        {/*form*/}
        <div className="col-lg-6 mt-3 mx-auto">
          <Form>

            {/*nome*/}
            <Form.Group className="mb-3">
              <Form.Label>Nome completo*</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite seu nome completo"
                value={usuario.nome}
                onChange={event => setUsuario({...usuario, nome: event.target.value})}/>
            </Form.Group>

            {/*cpf*/}
            <Form.Group className="mb-3">
              <Form.Label>CPF*</Form.Label>
              <Form.Control
                type="text"
                placeholder="000.000.000-00"
                value={usuario.cpf}
                onChange={event => setUsuario({...usuario, cpf: mascaraCpf(event.target.value)})}/>
            </Form.Group>

            {/*email*/}
            <Form.Group className="mb-3">
              <Form.Label>Email*</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite seu email"
                value={usuario.email}
                onChange={event => setUsuario({...usuario, email: event.target.value})}/>
            </Form.Group>

            {/*senha*/}
            <Form.Group className="mb-3">
              <Form.Label>Senha*</Form.Label>
              <Form.Control
                type="password"
                placeholder="Crie uma senha"
                value={usuario.senha}
                onChange={event => setUsuario({...usuario, senha: event.target.value})}/>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Repita a senha*</Form.Label>
              <Form.Control
                type="password"
                placeholder="Repita a senha, por favor"
                value={usuario.senhaRepeticao || ''}
                onChange={event => setUsuario({...usuario, senhaRepeticao: event.target.value})}/>
            </Form.Group>

            <div className="my-4 d-lg-flex gap-2 align-items-center">

              {/*check de privacidade*/}
              <div className='rounded border border-1 border-dark-subtle d-flex gap-2 align-items-center p-2 flex-grow-1'>
                <Form.Check
                  type='checkbox'
                  checked={checkPrivacidade}
                  onChange={event => setCheckPrivacidade(event.target.checked)}
                />
                <span>Li e concordo com a <a className='clicavel' onClick={irParaPoliticaPrivacidade}>Política de Privacidade.</a></span>
              </div>

              {/*botão*/}
              <div className='mt-4 mt-lg-0'>
                <Button className="" variant="warning" onClick={() => cadastrar()}> Cadastrar </Button>
              </div>

            </div>


          </Form>
        </div>

      </div>
    </div>


  )
}