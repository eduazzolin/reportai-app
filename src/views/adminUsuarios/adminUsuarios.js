import React, {useContext, useEffect, useState} from "react";
import PopupConfirmacao from "../../components/popupConfirmacao/popupConfirmacao";
import {mensagemErro} from "../../components/toastr";
import UsuarioService from "../../app/service/usuarioService";

export default function AdminUsuarios() {

  const [visibilidadePopupRemocao, setVisibilidadePopupRemocao] = useState(false);
  const [usuarios, setUsuarios] = useState([]);

  const service = new UsuarioService();

  const handleRemover = () => {
    setVisibilidadePopupRemocao(false);
  }

  useEffect(() => {
    service.
      buscarTodos()
      .then(response => {
        setUsuarios(response.data);
      }).catch(error => {
        mensagemErro(error?.response?.data?.descricao ?? 'Erro ao carregar usuários');
      });
  }, []);


  return (
    <div className='container'>

      {/* ---------------------- popups ---------------------- */}
      <PopupConfirmacao
        visivel={visibilidadePopupRemocao}
        titulo="Remover usuário"
        mensagem="Tem certeza que deseja remover o usuário?"
        onConfirm={handleRemover}
        onCancel={() => setVisibilidadePopupRemocao(false)}
      />


      {/* ---------------------- titulo ---------------------- */}
      <div className="row mt-3">
        <div className="col-12">
          <h2>Gerenciar usuários</h2>
        </div>
      </div>

    </div>

  );
}