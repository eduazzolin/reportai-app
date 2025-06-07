import React, {useContext, useEffect, useState} from "react";
import PopupConfirmacao from "../components/popupConfirmacao/popupConfirmacao";
import {mensagemErro, mensagemSucesso} from "../components/toastr";
import UsuarioService from "../app/service/usuarioService";
import DataTable from "react-data-table-component";
import {jsPDF} from 'jspdf'
import {autoTable} from 'jspdf-autotable'
import {MdEditSquare} from "react-icons/md";
import IconeCrudSemTexto from "../components/iconeCrudSemTexto/iconeCrudSemTexto";
import {BsFillXSquareFill, BsFolderFill} from "react-icons/bs";
import {useLocation, useNavigate} from "react-router-dom";
import Form from "react-bootstrap/Form";
import {AuthContext} from "../main/provedorAutenticacao";

export default function AdminUsuarios() {
  /**
   * https://www.npmjs.com/package/react-data-table-component
   * https://www.youtube.com/watch?v=3oHUtG0cjfY&ab_channel=CodeWithYousaf
   * https://www.npmjs.com/package/jspdf-autotable
   *
   */

  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const location = useLocation();

  const [visibilidadePopupRemocao, setVisibilidadePopupRemocao] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [linhaSelecionada, setLinhaSelecionada] = useState();
  const [pagina, setPagina] = useState(0);
  const [limite, setLimite] = useState(10);
  const [totalUsuarios, setTotalUsuarios] = useState(0);
  const [termo, setTermo] = useState();
  const [filtroId, setFiltroId] = useState(location.state?.usuarioFiltro);
  const [ordenacao, setOrdenacao] = useState('nome ASC');

  const service = new UsuarioService();

  useEffect(() => {
    document.title = 'Reportaí - Administração de Usuários';
  }, []);


  function handleEditar(linha) {
    navigate('/minha-conta', {state: {idUsuario: linha.id}});
  }

  function handleRemover(linha) {
    setVisibilidadePopupRemocao(true);
    setLinhaSelecionada(linha);
  }

  function removerUsuario() {
    service
      .deletar(linhaSelecionada.id)
      .then(response => {
        setVisibilidadePopupRemocao(false);
        setLinhaSelecionada(null);
        buscarUsuarios();
        mensagemSucesso('Usuário removido com sucesso');
      }).catch(error => {
      setVisibilidadePopupRemocao(false);
      setLinhaSelecionada(null);
      mensagemErro(error?.response?.data?.descricao ?? 'Erro ao remover usuário');
    });
  }

  function buscarUsuarios() {
    service.buscarTodos(pagina, limite, termo, filtroId, ordenacao)
      .then(response => {
        setUsuarios(response.data.usuarios);
        setTotalUsuarios(response.data.totalUsuarios);
        setPagina(response.data.pagina);
        console.log(response.data);
      }).catch(error => {
      mensagemErro(error?.response?.data?.descricao ?? 'Erro ao carregar usuários');
    });
  }

  async function exportarPDF() {
    try {
      const response = await service.buscarTodos(0, totalUsuarios, termo, ordenacao);
      const usuariosCompletos = response.data.usuarios;

      const doc = new jsPDF()

      // itens da tabela
      const headers = colunas.filter(coluna => coluna.name !== 'Ações').map(coluna => coluna.name);
      const dados = usuariosCompletos.map(usuario => [
        usuario.id,
        usuario.nome,
        usuario.email,
        usuario.cpf,
        usuario.totalRegistros,
        new Date(usuario.dtCriacao).toLocaleString(),
        new Date(usuario.dtModificacao).toLocaleString()
      ]);

      // cabeçalhlo do documento
      doc.setFontSize(16);
      const w = (4598 / 100);
      const h = (1169 / 100);
      const img = new Image();
      img.src = '/logo.png';
      doc.addImage(img, 'PNG', 14, 8, w, h, undefined, 'FAST');
      doc.text('Relatório de Usuários', 14, 26);
      doc.setFontSize(10);
      doc.text(`Relatório gerado em ${new Date().toLocaleString()}.`, 14, 32)

      autoTable(doc, {
        head: [headers],
        body: dados,
        startY: 37,
        theme: 'grid',
        styles: {
          textColor: 0,
          overflow: 'linebreak',
          fontSize: 8
        },
        headStyles: {
          fillColor: [241, 197, 83],
          textColor: 0,
          fontStyle: 'bold',
          fontSize: 8,
          lineWidth: 0.2,
        },
        columnStyles: {
          0: {cellWidth: 13},
          1: {cellWidth: 39},
          2: {cellWidth: 37},
          3: {cellWidth: 26},
        }
      })

      // rodapé
      const totalPaginas = doc.internal.getNumberOfPages()
      for (let i = 1; i <= totalPaginas; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(`Página ${i} de ${totalPaginas}`, 15, 290);
      }

      // salva o PDF
      doc.save('usuarios.pdf');

    } catch (error) {
      console.log(error);
      mensagemErro(error?.response?.data?.descricao ?? 'Erro ao exportar usuários');
    }
  };

  const colunas = [
    {
      name: 'Ações',
      cell: (row) => (
        <div className="d-flex gap-1">
          <IconeCrudSemTexto icone={MdEditSquare} cor={'#bf9600'} funcao={() => handleEditar(row)} tooltip='Editar'/>
          <IconeCrudSemTexto icone={BsFillXSquareFill} cor={'#D3310ED1'} funcao={() => handleRemover(row)} tooltip='Remover'/>
          <IconeCrudSemTexto icone={BsFolderFill} cor={'rgba(0,93,151,0.82)'} funcao={() => {
            navigate('/admin/registros', {state: {usuarioFiltro: row.id}});
          }} tooltip='Registros'/>
        </div>
      ),
      grow: 2,
    },
    {
      name: 'ID',
      selector: row => row.id,
      reorder: true,
      grow: 1,
      sortable: true,
      sortField: 'id',
    },
    {
      name: 'Nome',
      selector: row => row.nome,
      reorder: true,
      wrap: true,
      grow: 3,
      sortable: true,
      sortField: 'nome',
    },
    {
      name: 'Email',
      selector: row => row.email,
      reorder: true,
      wrap: true,
      grow: 3,
      sortable: true,
      sortField: 'email',
    },
    {
      name: 'CPF',
      selector: row => row.cpf,
      reorder: true,
      wrap: true,
      grow: 2,
    },
    {
      name: 'Qtd. registros',
      selector: row => row.totalRegistros,
      reorder: true,
      wrap: true,
      grow: 2,
      sortable: true,
      sortField: 'totalRegistros',
    },
    {
      name: 'Data de Criação',
      selector: row => new Date(row.dtCriacao).toLocaleString(),
      reorder: true,
      wrap: true,
      grow: 2,
      sortable: true,
      sortField: 'dtCriacao',
    },
    {
      name: 'Data de Modificação',
      selector: row => new Date(row.dtModificacao).toLocaleString(),
      reorder: true,
      wrap: true,
      grow: 2,
      sortable: true,
      sortField: 'dtModificacao',
    }

  ]


  useEffect(() => {
    buscarUsuarios();
  }, [termo, pagina, limite, ordenacao, filtroId]);


  return (
    <div>
      {
        !authContext.isAdmin

          ?

          <div className="row mt-5">
            <div className="col-12 d-flex flex-column justify-content-center align-items-center">
              <img src="/logo.png" alt="Logo Reportaí" width={200} className='mt-5 mb-3'/>
              <h2>Você não tem permissão para acessar essa página.</h2>
            </div>
          </div>

          :

          <div className='container'>

            {/* ---------------------- popups ---------------------- */}
            <PopupConfirmacao
              visivel={visibilidadePopupRemocao}
              titulo="Remover usuário"
              mensagem={`Tem certeza que deseja remover o usuário "${linhaSelecionada?.nome ?? ''}"? os registros associados a ele não serão removidos.`}
              onConfirm={removerUsuario}
              onCancel={() => setVisibilidadePopupRemocao(false)}
            />

            {/* ---------------------- titulo ---------------------- */}
            <div className="row mt-3">
              <div className="col-12 d-flex justify-content-between my-auto">
                <h2>Gerenciar usuários</h2>
                <button className="btn btn-warning text-nowrap my-auto" onClick={exportarPDF}>Exportar PDF</button>
              </div>
            </div>

            {/* ---------------------- tabela ---------------------- */}
            <div className="row">

              {/*pesquisa*/}
              <div className="col-12 my-2 d-flex gap-2">
                <Form.Group className="mb-3">
                  <Form.Label>ID</Form.Label>
                  <Form.Control
                    type="text"
                    value={filtroId}
                    placeholder="Digite o ID do usuário"
                    onChange={(event) => {setFiltroId(event.target.value); setPagina(0);}}/>
                </Form.Group>
                <Form.Group className="mb-3 flex-grow-1 ">
                  <Form.Label>Nome, email ou CPF</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Digite o nome, email ou CPF do usuário"
                    onChange={(event) => {setTermo(event.target.value); setPagina(0);}}/>
                </Form.Group>

              </div>

              {/*tabela*/}
              <DataTable
                columns={colunas}
                data={usuarios}
                fixedHeader
                pagination
                responsive
                dense
                paginationServer
                fixedHeaderScrollHeight={'calc(100vh - 284px)'}
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
                onSort={(column, sortDirection) => {
                  setOrdenacao(`${column.sortField ?? 'nome'} ${sortDirection}`);
                }}
              />
            </div>


          </div>
      }
    </div>
  );
}