import React, {useContext, useEffect, useState} from "react";
import {useNavigate} from 'react-router-dom';
import Form from "react-bootstrap/Form";
import UsuarioService, {usuarioPrototype} from "../app/service/usuarioService";
import {Button} from "react-bootstrap";
import {mensagemErro, mensagemSucesso} from "../components/toastr";
import {AuthContext} from "../main/provedorAutenticacao";
import LocalStorageService from "../app/service/localStorageService";
import {USUARIO_LOGADO} from "../app/service/authService";
import PopupConfirmacao from "../components/popupConfirmacao/popupConfirmacao";
import {RegistroService} from "../app/service/registroService";
import CardRegistroLateral from "../components/cardRegistroLateral/cardRegistroLateral";
import CardRegistroMeusRegistros from "../components/cardRegistroMeusRegistros/cardRegistroMeusRegistros";

export default function MeusRegistros() {

  const [usuario, setUsuario] = useState(usuarioPrototype);
  const [pagina, setPagina] = useState(0);
  const [visibilidadePopupRemocao, setVisibilidadePopupRemocao] = useState(false);
  const [visibilidadePopupConclusao, setVisibilidadePopupConclusao] = useState(false);
  const [registros, setRegistros] = useState([]);
  const [registroSelecionado, setRegistroSelecionado] = useState(null);
  const navigate = useNavigate();

  const service = new RegistroService();

  const abrirPopupRemocao = (idRegistro) => {
    setVisibilidadePopupRemocao(true)
    setRegistroSelecionado(idRegistro)
  }

  const fecharPopupRemocao = () => {
    setVisibilidadePopupRemocao(false)
  }


  const abrirPopupConclusao = (idRegistro) => {
    setVisibilidadePopupConclusao(true)
    setRegistroSelecionado(idRegistro)
  }

  const fecharPopupConclusao = () => {
    setVisibilidadePopupConclusao(false)

  }

  const handleRemover = () => {
    setVisibilidadePopupRemocao(false);
    service
      .deletar(registroSelecionado)
      .then(response => {
        mensagemSucesso("Registro removido com sucesso!");
        loadRegistros()
      }).catch(error => {
      mensagemErro(error?.response?.data?.descricao ?? 'Erro ao remover registro');
    });
  }

  const handleConcluir = () => {
    setVisibilidadePopupConclusao(false);
    service
      .concluir(registroSelecionado)
      .then(response => {
        mensagemSucesso("Registro concluído com sucesso!");
        loadRegistros()
      }).catch(error => {
      mensagemErro(error?.response?.data?.descricao ?? 'Erro ao concluir registro');
    });
  }

  const loadRegistros = () => {
    service
      .consultarMeusRegistros(pagina)
      .then(response => {
        setRegistros(response.data.registros);
        console.log(response.data);
      }).catch(error => {
      mensagemErro(error?.response?.data?.descricao ?? 'Erro ao buscar registros');
    });
  }

  useEffect(() => {
    loadRegistros()
  }, [pagina]);

  return (
    <div className='container'>

      {/* ---------------------- popups ---------------------- */}
      <PopupConfirmacao
        visivel={visibilidadePopupRemocao}
        titulo="Remover registro"
        mensagem="Tem certeza que deseja remover o registro? Não é possível desfazer esta ação."
        onConfirm={handleRemover}
        onCancel={fecharPopupRemocao}
      />
      <PopupConfirmacao
        visivel={visibilidadePopupConclusao}
        titulo="Concluir registro"
        mensagem="Tem certeza que deseja concluir o registro? Não é possível desfazer esta ação."
        onConfirm={handleConcluir}
        onCancel={fecharPopupConclusao}
      />

      {/* ---------------------- titulo ---------------------- */}
      <div className="row mt-3">
        <div className="col-12">
          <h2>Meus registros</h2>
        </div>
      </div>

      {/* ---------------------- cards ---------------------- */}
      <div className="row">

        {
          registros.map((registro, index) => (
            <div key={index} className={'p-2 col-md-6 col-xl-4'}>
              <CardRegistroMeusRegistros
                key={index}
                registro={registro}
                funcaoRemover={abrirPopupRemocao}
                funcaoConcluir={abrirPopupConclusao}
              />
            </div>
          ))
        }


      </div>
    </div>

  )
}