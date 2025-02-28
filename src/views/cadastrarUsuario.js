import React, {useState} from "react";
import {useNavigate} from 'react-router-dom';
import Form from "react-bootstrap/Form";
import UsuarioService, {usuarioPrototype} from "../app/service/usuarioService";
import {Button} from "react-bootstrap";


export default function CadastrarUsuario() {

  // TODO: VALIDAR CPF


  const [usuario, setUsuario] = useState({usuarioPrototype});

  const navigate = useNavigate();
  const service = new UsuarioService();

  const cadastrar = () => {


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

  return (
    <div className='container'>
      <div className="row mt-5">

        {/*titulo*/}
        <div className="col-12">
          <h2>Faça parte do Reportaí 👋</h2>
        </div>

        {/*form*/}
        <div className="col-lg-6 mt-3">
          <Form>

            {/*nome*/}
            <Form.Group className="mb-3">
              <Form.Label>Nome completo</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite seu nome completo"
                value={usuario.nome}
                onChange={event => setUsuario({...usuario, nome: event.target.value})}/>
            </Form.Group>

            {/*cpf*/}
            <Form.Group className="mb-3">
              <Form.Label>CPF</Form.Label>
              <Form.Control
                type="text"
                placeholder="000.000.000-00"
                value={usuario.cpf}
                onChange={event => setUsuario({...usuario, cpf: mascaraCpf(event.target.value)})}/>
            </Form.Group>

            {/*email*/}
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite seu email"
                value={usuario.email}
                onChange={event => setUsuario({...usuario, email: event.target.value})}/>
            </Form.Group>

            {/*senha*/}
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
              <Button className="mt-3" variant="warning" onClick={() => cadastrar()}> Cadastrar </Button>


          </Form>
        </div>

      </div>
    </div>


  )
}