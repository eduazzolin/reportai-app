import React, {useContext, useEffect, useState} from "react";
import PopupConfirmacao from "../components/popupConfirmacao/popupConfirmacao";
import {mensagemErro, mensagemSucesso} from "../components/toastr";
import DataTable from "react-data-table-component";
import {jsPDF} from 'jspdf'
import {autoTable} from 'jspdf-autotable'
import {MdEditSquare} from "react-icons/md";
import IconeCrudSemTexto from "../components/iconeCrudSemTexto/iconeCrudSemTexto";
import {BsCheckSquareFill, BsFillXSquareFill} from "react-icons/bs";
import {useLocation, useNavigate} from "react-router-dom";
import {RegistroService} from "../app/service/registroService";
import Form from "react-bootstrap/Form";
import {categoriaPrototype, CategoriaService} from "../app/service/categoriaService";
import {AuthContext} from "../main/provedorAutenticacao";
import {HiUserCircle} from "react-icons/hi";
import {FaUserAlt} from "react-icons/fa";

export function AdminRegistros() {
  /**
   * https://www.npmjs.com/package/react-data-table-component
   * https://www.youtube.com/watch?v=3oHUtG0cjfY&ab_channel=CodeWithYousaf
   * https://www.npmjs.com/package/jspdf-autotable
   *
   */

  const navigate = useNavigate();
  const location = useLocation();
  const authContext = useContext(AuthContext);

  const statusPermitidos = [{id: '', nome: 'Qualquer status'}, {id: 'ATIVO', nome: 'Abertos'}, {id: 'CONCLUIDO', nome: 'Resolvidos'}];
  const [visibilidadePopupRemocao, setVisibilidadePopupRemocao] = useState(false);
  const [visibilidadePopupConclusao, setVisibilidadePopupConclusao] = useState(false);
  const [registros, setRegistros] = useState([]);
  const [linhaSelecionada, setLinhaSelecionada] = useState();
  const [pagina, setPagina] = useState(0);
  const [limite, setLimite] = useState(10);
  const [totalRegistros, setTotalRegistros] = useState(0);
  const [ordenacao, setOrdenacao] = useState('id ASC');
  const [pesquisaIdNome, setPesquisaIdNome] = useState('');
  const [pesquisaIdUsuario, setPesquisaIdUsuario] = useState(location.state?.usuarioFiltro);
  const [pesquisaCategoria, setPesquisaCategoria] = useState('');
  const [pesquisaBairro, setPesquisaBairro] = useState('');
  const [pesquisaStatus, setPesquisaStatus] = useState(statusPermitidos[0].id);
  const [categorias, setCategorias] = useState([categoriaPrototype])
  const categoriaService = new CategoriaService();
  const service = new RegistroService();


  useEffect(() => {
    document.title = 'Reportaí - Administração de Registros';
  }, []);


  function handleEditar(linha) {
    service
      .consultarPorId(linha.id)
      .then(response => {
        const registro = response.data;
        navigate('/cadastrar-registro', {state: {registro}});
      }).catch(error => {
      mensagemErro(error?.response?.data?.descricao ?? 'Erro ao carregar registro');
    })
  }

  function irParaUsuario(linha) {
    navigate('/minha-conta', {state: {idUsuario: linha.usuarioId}});
  }

  function irParaRegistro(linha) {
    window.open(`/registro/${linha.id}`, '_blank');
  };

  function handleRemover(linha) {
    setVisibilidadePopupRemocao(true);
    setLinhaSelecionada(linha);
  }

  function handleConcluir(linha) {
    setVisibilidadePopupConclusao(true);
    setLinhaSelecionada(linha);
  }

  function concluirRegistro() {
    setVisibilidadePopupConclusao(false);
    service
      .concluir(linhaSelecionada.id)
      .then(response => {
        mensagemSucesso("Registro concluído com sucesso!");
        buscarRegistros()
      }).catch(error => {
      mensagemErro(error?.response?.data?.descricao ?? 'Erro ao concluir registro');
    });
  }

  function removerRegistro() {
    service
      .deletar(linhaSelecionada.id)
      .then(response => {
        setVisibilidadePopupRemocao(false);
        setLinhaSelecionada(null);
        buscarRegistros();
        mensagemSucesso('Registro removido com sucesso');
      }).catch(error => {
      setVisibilidadePopupRemocao(false);
      setLinhaSelecionada(null);
      mensagemErro(error?.response?.data?.descricao ?? 'Erro ao remover registro');
    });
  }

  function buscarRegistros() {
    service.buscarTodos(pesquisaIdNome, pesquisaIdUsuario, pesquisaCategoria, pesquisaBairro, pesquisaStatus, pagina, limite, ordenacao)
      .then(response => {
        setRegistros(response.data.registros);
        setTotalRegistros(response.data.totalRegistros);
        setPagina(response.data.pagina);
        console.log(response.data);
      }).catch(error => {
      mensagemErro(error?.response?.data?.descricao ?? 'Erro ao carregar registros');
    });
  }

  async function exportarPDF() {
    try {
      const response = await service.buscarTodos(pesquisaIdNome, pesquisaIdUsuario, pesquisaCategoria, pesquisaBairro, pesquisaStatus, 0, totalRegistros, ordenacao);
      const registrosCompletos = response.data.registros;

      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm'
      });

      // itens da tabela
      // const headers = colunas.filter(coluna => coluna.name !== 'Ações').map(coluna => coluna.name);
      const headers = ['ID', 'Título', 'ID Usuário', 'Data de\nCriação', 'Data de\nModificação', 'Data de\nConclusão', 'Categoria', 'Bairro', 'Data Conclusão Programada', 'Qtd.\nRelevante', 'Qtd.\nIrrelevante', 'Qtd.\nNão está lá'];
      const dados = registrosCompletos.map(registro => [
        registro.id,
        registro.titulo,
        registro.usuarioId,
        new Date(registro.dtCriacao).toLocaleString(),
        new Date(registro.dtModificacao).toLocaleString(),
        registro.dtConclusao ? new Date(registro.dtConclusao).toLocaleString() : '',
        registro.categoria,
        registro.bairro,
        registro.dtAteConclusao ? new Date(registro.dtAteConclusao).toLocaleString() : '',
        registro.qtRelevante,
        registro.qtIrrelevante,
        registro.qtConcluido
      ]);

      // cabeçalhlo do documento
      doc.setFontSize(16);
      const w = (4598 / 100);
      const h = (1169 / 100);
      const img = new Image();
      img.src = '/logo.png';
      doc.addImage(img, 'PNG', 14, 8, w, h, undefined, 'FAST');
      doc.text('Relatório de Registros', 14, 26);
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
          0: {cellWidth: 10},
          1: {cellWidth: 42},
          2: {cellWidth: 16},
          3: {cellWidth: 21},
          4: {cellWidth: 22},
          5: {cellWidth: 21},
          6: {cellWidth: 27},
          7: {cellWidth: 30},
          8: {cellWidth: 27},
        }
      })

      // rodapé
      const totalPaginas = doc.internal.getNumberOfPages()
      for (let i = 1; i <= totalPaginas; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(`Página ${i} de ${totalPaginas}`, 15, 205);
      }

      // salva o PDF
      doc.save('registros.pdf');

    } catch (error) {
      console.log(error);
      mensagemErro(error?.response?.data?.descricao ?? 'Erro ao exportar registros');
    }
  };

  const colunas = [
    {
      name: 'Ações',
      cell: (row) => (
        <div className="d-flex gap-1">
          <IconeCrudSemTexto icone={MdEditSquare} cor={'#bf9600'} funcao={() => handleEditar(row)} tooltip='Editar'/>
          <IconeCrudSemTexto icone={BsFillXSquareFill} cor={'#D3310ED1'} funcao={() => handleRemover(row)} tooltip='Remover'/>
          <IconeCrudSemTexto icone={FaUserAlt} cor={'rgba(0,93,151,0.82)'} funcao={() => {
            navigate('/admin/usuarios', {state: {usuarioFiltro: row.usuarioId}});
          }} tooltip='Ver usuário'/>
          {row.dtConclusao ? '' :
            <IconeCrudSemTexto icone={BsCheckSquareFill} cor={'rgba(39,151,0,0.82)'} funcao={() => handleConcluir(row)} tooltip='Marcar como resolvido'/>}
        </div>
      ),
      minWidth: '140px',

    },
    {
      name: 'ID',
      selector: row => row.id,
      reorder: true,
      sortable: true,
      sortField: 'id',
      minWidth: '50px',
    },
    {
      name: 'Título',
      cell: (row) => (
        <div onClick={() => irParaRegistro(row)} className='clicavel'>{row.titulo}</div>
      ),
      reorder: true,
      wrap: true,
      sortable: true,
      sortField: 'titulo',
      minWidth: '200px',
    },
    {
      name: 'ID do Usuário',
      selector: row => row.usuarioId,
      cell: (row) => (
        <div onClick={() => irParaUsuario(row)} className='clicavel'>{row.usuarioId}</div>
      ),
      reorder: true,
      wrap: true,
      sortable: true,
      sortField: 'usuarioId',
      minWidth: '130px',
      center: true,
    },
    {
      name: 'Data de Criação',
      selector: row => new Date(row.dtCriacao).toLocaleString(),
      reorder: true,
      wrap: true,
      sortable: true,
      sortField: 'dtCriacao',
      minWidth: '160px',
    },
    {
      name: 'Data de Modificação',
      selector: row => new Date(row.dtModificacao).toLocaleString(),
      reorder: true,
      wrap: true,
      sortable: true,
      sortField: 'dtModificacao',
      minWidth: '160px',
    },
    {
      name: 'Data de Resolução',
      selector: row => row.dtConclusao ? new Date(row.dtConclusao).toLocaleString() : '',
      reorder: true,
      wrap: true,
      sortable: true,
      sortField: 'dtConclusao',
      minWidth: '160px',
    },
    {
      name: 'Categoria',
      selector: row => row.categoria,
      reorder: true,
      sortable: true,
      wrap: true,
      sortField: 'categoria',
      minWidth: '180px',
    },
    {
      name: 'Bairro',
      selector: row => row.bairro,
      reorder: true,
      wrap: true,
      sortable: true,
      sortField: 'bairro',
      minWidth: '180px',
    },
    {
      name: 'Data de Resolução Programada',
      selector: row => row.dtAteConclusao ? new Date(row.dtAteConclusao).toLocaleString() : '',
      reorder: true,
      wrap: true,
      sortable: true,
      sortField: 'dtAteConclusao',
      minWidth: '220px',
    },
    {
      name: 'Qtd. Relevante',
      selector: row => row.qtRelevante,
      reorder: true,
      wrap: true,
      sortable: true,
      minWidth: '140px',
      sortField: 'qtRelevante',
      center: true,
    },
    {
      name: 'Qtd. Irrelevante',
      selector: row => row.qtIrrelevante,
      reorder: true,
      wrap: true,
      sortable: true,
      minWidth: '140px',
      sortField: 'qtIrrelevante',
      center: true,
    },
    {
      name: 'Qtd. Não está lá',
      selector: row => row.qtConcluido,
      reorder: true,
      wrap: true,
      sortable: true,
      minWidth: '140px',
      sortField: 'qtConcluido',
      center: true,
    }
  ]

  /* Carrega as categorias */
  useEffect(() => {
    categoriaService
      .consultar()
      .then(response => {
        const categoriasResponse = response.data;
        const opcaoTodas = {id: '', nome: 'Todas'};
        setCategorias([opcaoTodas, ...categoriasResponse]);
        setPesquisaCategoria(opcaoTodas.id)
      }).catch(error => {
      console.log(error);
    });
  }, []);

  useEffect(() => {
    buscarRegistros();
  }, [pagina, limite, ordenacao, pesquisaIdNome, pesquisaIdUsuario, pesquisaCategoria, pesquisaBairro, pesquisaStatus]);


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
              titulo="Remover registro"
              mensagem={`Tem certeza que deseja remover o registro "${linhaSelecionada?.titulo ?? ''}"?`}
              onConfirm={removerRegistro}
              onCancel={() => setVisibilidadePopupRemocao(false)}
            />

            <PopupConfirmacao
              visivel={visibilidadePopupConclusao}
              titulo="Concluir registro"
              mensagem={`Tem certeza que deseja concluir o registro "${linhaSelecionada?.titulo ?? ''}"?`}
              onConfirm={concluirRegistro}
              onCancel={() => setVisibilidadePopupConclusao(false)}
            />

            {/* ---------------------- titulo ---------------------- */}
            <div className="row mt-3">
              <div className="col-12 d-flex justify-content-between">
                <h2>Gerenciar registros</h2>
                <button className="btn btn-warning text-nowrap flex-grow-0 my-auto" onClick={exportarPDF}>Exportar PDF</button>
              </div>
            </div>

            {/* ---------------------- tabela e filtros ---------------------- */}
            <div className="row">

              {/*pesquisa e exportar*/}
              {/*id ou titulo*/}
              <div className="col-12 my-2 d-flex gap-2 p-2">
                <Form.Group className="mb-3 flex-grow-1">
                  <Form.Label>ID ou Título do registro</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Digite o ID ou Título do registro"
                    onKeyUp={(event) => {setPesquisaIdNome(event.target.value); setPagina(0);}}/>
                </Form.Group>

                {/*id do usuário*/}
                <Form.Group className="mb-3 flex-grow-0">
                  <Form.Label>ID do usuário</Form.Label>
                  <Form.Control
                    type="text"
                    value={pesquisaIdUsuario}
                    placeholder="Digite o ID do usuário"
                    onChange={event => {setPesquisaIdUsuario(event.target.value); setPagina(0);}}/>
                </Form.Group>

                {/*bairro*/}
                <Form.Group className="mb-3 flex-grow-0">
                  <Form.Label>Bairro</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Digite o bairro"
                    onChange={(event) => {setPesquisaBairro(event.target.value); setPagina(0);}}/>
                </Form.Group>

                {/*categoria*/}
                <Form.Group className="mb-3 flex-grow-0">
                  <Form.Label>Categoria</Form.Label>
                  <Form.Select
                    aria-label="Categoria"
                    value={pesquisaCategoria}
                    onChange={event => {
                      const categoriaSelecionada = categorias.find(cat => cat.id == event.target.value);
                      setPesquisaCategoria(categoriaSelecionada.id);
                      setPagina(0);
                    }}>

                    {/*opções*/}
                    {categorias.map((categoria, index) => (
                      <option key={index} value={categoria.id}>{categoria.nome}</option>
                    ))}
                  </Form.Select>
                </Form.Group>

                {/*status*/}
                <Form.Group className="mb-3 flex-grow-0">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    aria-label="Status"
                    value={pesquisaStatus}
                    onChange={event => {
                      const statusSelecionado = statusPermitidos.find(cat => cat.id == event.target.value);
                      setPesquisaStatus(statusSelecionado.id)
                      console.log(statusSelecionado.id)
                      setPagina(0);
                    }}>

                    {/*opções*/}
                    {statusPermitidos.map((status, index) => (
                      <option key={index} value={status.id}>{status.nome}</option>
                    ))}
                  </Form.Select>
                </Form.Group>

              </div>

              {/*tabela*/}
              <DataTable
                columns={colunas}
                data={registros}
                fixedHeader
                pagination
                responsive
                dense
                paginationServer
                fixedHeaderScrollHeight={'calc(100vh - 284px)'}
                paginationTotalRows={totalRegistros}
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
                  setOrdenacao(`${column.sortField ?? 'dtCriacao'} ${sortDirection}`);
                }}
              />
            </div>


          </div>
      }
    </div>
  );
}