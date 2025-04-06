import React, {useContext, useEffect, useState} from "react";
import PopupConfirmacao from "../../components/popupConfirmacao/popupConfirmacao";
import {mensagemErro} from "../../components/toastr";
import UsuarioService from "../../app/service/usuarioService";
import DataTable from "react-data-table-component";
import Pagination from "react-bootstrap/Pagination";

export default function AdminUsuarios() {
  /**
   * https://www.npmjs.com/package/react-data-table-component
   * https://www.youtube.com/watch?v=3oHUtG0cjfY&ab_channel=CodeWithYousaf
   */

  const [visibilidadePopupRemocao, setVisibilidadePopupRemocao] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [pagina, setPagina] = useState(0);
  const [limite, setLimite] = useState(10);
  const [totalUsuarios, setTotalUsuarios] = useState(0);
  const [termo, setTermo] = useState('');

  const service = new UsuarioService();

  const colunas = [
    {
      name: 'ID',
      selector: row => row.id,
    },
    {
      name: 'Nome',
      selector: row => row.nome,
    },
    {
      name: 'Email',
      selector: row => row.email,
    },
    {
      name: 'CPF',
      selector: row => row.cpf,
    },
    {
      name: 'Data de Criação',
      selector: row => new Date(row.dtCriacao).toLocaleString(),
    },
    {
      name: 'Data de Modificação',
      selector: row => new Date(row.dtModificacao).toLocaleString(),
    },
  ]


  const handleRemover = () => {
    setVisibilidadePopupRemocao(false);
  }

  function buscarUsuarios() {
    service.buscarTodos(pagina, limite, termo)
      .then(response => {
        setUsuarios(response.data.usuarios);
        setTotalUsuarios(response.data.totalUsuarios);
        setPagina(response.data.pagina);
        console.log(response.data);
      }).catch(error => {
      mensagemErro(error?.response?.data?.descricao ?? 'Erro ao carregar usuários');
    });
  }

  useEffect(() => {
    buscarUsuarios();
  }, [termo, pagina, limite]);

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

      {/* ---------------------- tabela ---------------------- */}
      <div className="row">
        <input type="text"
               className="form-control my-3"
               placeholder="Pesquisar por ID, nome, email ou CPF"
               onKeyUp={(event) => setTimeout(() => setTermo(event.target.value), 1000)}/>
        <DataTable
          columns={colunas}
          data={usuarios}
          fixedHeader
          fixedHeaderScrollHeight="400px"
          pagination
          paginationServer
          paginationTotalRows={totalUsuarios}
          paginationPerPage={limite}
          paginationDefaultPage={pagina + 1}
          paginationComponentOptions={{
            rowsPerPageText: 'Linhas por página',
            rangeSeparatorText: 'de',
          }}
          paginationRowsPerPageOptions={[10, 50, 100]}
          onChangePage={(page) => setPagina(page - 1)}
          onChangeRowsPerPage={(newLimit, page) => {
            setLimite(newLimit);
            setPagina(page - 1);
          }}
          highlightOnHover
        />

      </div>


    </div>

  );
}