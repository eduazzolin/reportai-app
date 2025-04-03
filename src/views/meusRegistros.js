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
  const [registros, setRegistros] = useState([]);
  const navigate = useNavigate();
  const service = new UsuarioService();
  const registroService = new RegistroService();

  const abrirPopupRemocao = () => {
    setVisibilidadePopupRemocao(true)
  }

  const fecharPopupRemocao = () => {
    setVisibilidadePopupRemocao(false)
  }

  const handleDelete = () => {
  }

  useEffect(() => {
    registroService
      .consultarMeusRegistros(pagina)
      .then(response => {
        setRegistros(response.data.registros);
        console.log(response.data);
      }).catch(error => {
      mensagemErro(error?.response?.data?.descricao ?? 'Erro ao buscar registros');
    });
  }, [pagina]);

  return (
    <div className='container'>

      <PopupConfirmacao
        visivel={visibilidadePopupRemocao}
        titulo="Remover conta"
        mensagem="Tem certeza que deseja remover sua conta? Todos os seus registros continuarão publicados, mas você não poderá mais acessar o sistema."
        onConfirm={handleDelete}
        onCancel={fecharPopupRemocao}
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
              />
            </div>
          ))
        }


      </div>
    </div>

  )
}