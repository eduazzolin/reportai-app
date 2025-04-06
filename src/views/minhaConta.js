import React, {useContext, useEffect, useState} from "react";
import {useLocation, useNavigate} from 'react-router-dom';
import Form from "react-bootstrap/Form";
import UsuarioService, {usuarioPrototype} from "../app/service/usuarioService";
import {Button} from "react-bootstrap";
import {mensagemErro, mensagemSucesso} from "../components/toastr";
import {AuthContext} from "../main/provedorAutenticacao";
import LocalStorageService from "../app/service/localStorageService";
import {USUARIO_LOGADO} from "../app/service/authService";
import PopupConfirmacao from "../components/popupConfirmacao/popupConfirmacao";

export default function MinhaConta() {

  const navigate = useNavigate();
  const location = useLocation();
  const {encerrarSessao} = useContext(AuthContext);

  const [usuario, setUsuario] = useState(usuarioPrototype);
  const [visibilidadePopupRemocao, setVisibilidadePopupRemocao] = useState(false);
  const idUsuarioRecebido = location.state?.idUsuario;

  const service = new UsuarioService();


  const cadastrar = () => {

    try {
      service.validar(usuario, true);
    } catch (erro) {
      const msgs = erro.mensagens;
      msgs.forEach(msg => mensagemErro(msg));
      return false;
    }

    service
      .salvar(usuario)
      .then(response => {
        mensagemSucesso('Usuario editado com sucesso!');
        if (!idUsuarioRecebido) {
          encerrarSessao();
        }
      })
      .catch(error => {
        mensagemErro(error?.response?.data?.descricao ?? 'Erro ao editar usuario.');
      })

  }

  const abrirPopupRemocao = () => {
    setVisibilidadePopupRemocao(true)
  }

  const fecharPopupRemocao = () => {
    setVisibilidadePopupRemocao(false)
  }

  const handleDelete = () => {
    service
      .deletar(usuario.id)
      .then(response => {
        mensagemSucesso('Conta removida com sucesso!');
        encerrarSessao();
      })
      .catch(error => {
        mensagemErro(error.response.data)
      })
  }


  useEffect(() => {
    /* Carrega o usuário recebido, se houver */
    if (idUsuarioRecebido) {

      service
        .buscarDTOPorId(idUsuarioRecebido)
        .then(response => {
          setUsuario(response.data)
        }).catch(error => {
        mensagemErro(error?.response?.data?.descricao ?? 'Erro ao buscar usuario.');
      });

      /* senão carrega o usuário logado */
    } else {
      const usuarioStorage = LocalStorageService.obterItem(USUARIO_LOGADO);
      service
        .buscarDTOPorId(usuarioStorage.id)
        .then(response => {
          setUsuario(response.data)
          console.log('01', response.data)
        })
        .catch(error => {
          mensagemErro(error?.response?.data?.descricao ?? 'Erro ao buscar usuario.')
        });
    }
  }, [idUsuarioRecebido]);


  return (
    <div className='container'>

      <PopupConfirmacao
        visivel={visibilidadePopupRemocao}
        titulo="Remover conta"
        mensagem="Tem certeza que deseja remover sua conta? Todos os seus registros continuarão publicados, mas você não poderá mais acessar o sistema."
        onConfirm={handleDelete}
        onCancel={fecharPopupRemocao}
      />

      <div className="row mt-5">

        {/*titulo*/}
        <div className="col-12">
          <h2>👤 {usuario.nome}</h2>
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
                disabled={true}
                value={usuario.cpf}/>
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
                value={usuario.senha}
                onChange={event => setUsuario({...usuario, senha: event.target.value})}/>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Repita a senha</Form.Label>
              <Form.Control
                type="password"
                placeholder="Repita a senha, por favor"
                value={usuario.senhaRepeticao || ''}
                onChange={event => setUsuario({...usuario, senhaRepeticao: event.target.value})}/>
            </Form.Group>

            {/*botão*/}
            <div className='d-flex gap-2'>
              <Button className="mt-3" variant="warning" onClick={() => cadastrar()}> Salvar alterações </Button>
              <Button className="mt-3" variant="danger" onClick={() => abrirPopupRemocao()}> Remover conta </Button>
            </div>


          </Form>
        </div>

      </div>
    </div>

  )
}