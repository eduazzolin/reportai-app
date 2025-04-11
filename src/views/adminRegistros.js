import React, {useEffect, useState} from "react";
import PopupConfirmacao from "../components/popupConfirmacao/popupConfirmacao";
import {mensagemErro, mensagemSucesso} from "../components/toastr";
import DataTable from "react-data-table-component";
import {jsPDF} from 'jspdf'
import {autoTable} from 'jspdf-autotable'
import IconeCrud from "../components/iconeCrud/iconeCrud";
import {MdEditSquare} from "react-icons/md";
import IconeCrudSemTexto from "../components/iconeCrudSemTexto/iconeCrudSemTexto";
import {BsCheckSquareFill, BsFillXSquareFill, BsFolderFill} from "react-icons/bs";
import {useLocation, useNavigate} from "react-router-dom";
import {RegistroService} from "../app/service/registroService";

export default function AdminRegistros() {
  /**
   * https://www.npmjs.com/package/react-data-table-component
   * https://www.youtube.com/watch?v=3oHUtG0cjfY&ab_channel=CodeWithYousaf
   * https://www.npmjs.com/package/jspdf-autotable
   *
   */

  const navigate = useNavigate();
  const location = useLocation();

  const [visibilidadePopupRemocao, setVisibilidadePopupRemocao] = useState(false);
  const [visibilidadePopupConclusao, setVisibilidadePopupConclusao] = useState(false);
  const [registros, setRegistros] = useState([]);
  const [linhaSelecionada, setLinhaSelecionada] = useState();
  const [pagina, setPagina] = useState(0);
  const [limite, setLimite] = useState(10);
  const [totalRegistros, setTotalRegistros] = useState(0);
  const [ordenacao, setOrdenacao] = useState('nome ASC');
  const [pesquisaIdNome, setPesquisaIdNome] = useState('');
  const [pesquisaIdUsuario, setPesquisaIdUsuario] = useState(location.state?.usuarioFiltro);
  const [pesquisaCategoria, setPesquisaCategoria] = useState('');
  const [pesquisaBairro, setPesquisaBairro] = useState('');
  const [pesquisaStatus, setPesquisaStatus] = useState('');


  const service = new RegistroService();

  useEffect(() => {
    document.title = 'Reportaí - Administração de Registros';
  }, []);

  const handleEditar = (linha) => {
    service
      .consultarPorId(linha.id)
      .then(response => {
        const registro = response.data;
        navigate('/cadastrar-registro', {state: {registro}});
      }).catch(error => {
      mensagemErro(error?.response?.data?.descricao ?? 'Erro ao carregar registro');
    })
  }

  const irParaUsuario = (linha) => {
    navigate('/minha-conta', {state: {idUsuario: linha.usuarioId}});
  }

  const irParaRegistro = (linha) => {
    window.open(`/registro/${linha.id}`, '_blank');
  };


  const handleRemover = (linha) => {
    setVisibilidadePopupRemocao(true);
    setLinhaSelecionada(linha);
  }

  const handleConcluir = (linha) => {
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

  const colunas = [
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
      name: 'Data de Conclusão',
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
      name: 'Data de Conclusão Programada',
      selector: row => row.dtAteConclusao,
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
      name: 'Qtd. Concluído',
      selector: row => row.qtConcluido,
      reorder: true,
      wrap: true,
      sortable: true,
      minWidth: '140px',
      sortField: 'qtConcluido',
      center: true,
    },
    {
      name: 'Ações',
      cell: (row) => (
        <div className="d-flex gap-1">
          <IconeCrudSemTexto icone={MdEditSquare} cor={'#bf9600'} funcao={() => handleEditar(row)} tooltip='Editar'/>
          <IconeCrudSemTexto icone={BsFillXSquareFill} cor={'#D3310ED1'} funcao={() => handleRemover(row)} tooltip='Remover'/>
          <IconeCrudSemTexto icone={BsCheckSquareFill} cor={'rgba(39,151,0,0.82)'} funcao={() => handleConcluir(row)} tooltip='Concluir'/>
        </div>
      ),
      minWidth: '140px',

    },
  ]


  const exportarPDF = async () => {
    //TODO
    // try {
    //   const response = await service.buscarTodos(0, totalRegistros, termo);
    //   const registrosCompletos = response.data.registros;
    //
    //   const doc = new jsPDF()
    //
    //   // itens da tabela
    //   const headers = colunas.filter(coluna => coluna.name !== 'Ações').map(coluna => coluna.name);
    //   const dados = registrosCompletos.map(registro => [
    //     registro.id,
    //     registro.nome,
    //     registro.email,
    //     registro.cpf,
    //     new Date(registro.dtCriacao).toLocaleString(),
    //     new Date(registro.dtModificacao).toLocaleString()
    //   ]);
    //
    //   // cabeçalhlo do documento
    //   doc.setFontSize(16);
    //   const w = (4598 / 100);
    //   const h = (1169 / 100);
    //   const img = new Image();
    //   img.src = '/logo.png';
    //   doc.addImage(img, 'PNG', 14, 8, w, h, undefined, 'FAST');
    //   doc.text('Relatório de Registros', 14, 26);
    //   doc.setFontSize(10);
    //   doc.text(`Relatório gerado em ${new Date().toLocaleString()}.`, 14, 32)
    //
    //   autoTable(doc, {
    //     head: [headers],
    //     body: dados,
    //     startY: 37,
    //     theme: 'grid',
    //     styles: {
    //       textColor: 0,
    //       overflow: 'linebreak',
    //       fontSize: 9
    //     },
    //     headStyles: {
    //       fillColor: [241, 197, 83],
    //       textColor: 0,
    //       fontStyle: 'bold',
    //       fontSize: 9,
    //       lineWidth: 0.2,
    //     },
    //     columnStyles: {
    //       0: {cellWidth: 13}, // Width for the first column
    //       1: {cellWidth: 39}, // Width for the second column
    //       2: {cellWidth: 37},
    //       3: {cellWidth: 26},
    //     }
    //   })
    //
    //   // rodapé
    //   const totalPaginas = doc.internal.getNumberOfPages()
    //   for (let i = 1; i <= totalPaginas; i++) {
    //     if (i == 1) {
    //       continue
    //     }
    //     doc.setPage(i);
    //     doc.setFontSize(10);
    //     doc.text(`Página ${i} de ${totalPaginas}`, 15, 285);
    //   }
    //
    //   // salva o PDF
    //   doc.save('registros.pdf');
    //
    // } catch (error) {
    //   console.log(error);
    //   mensagemErro(error?.response?.data?.descricao ?? 'Erro ao exportar registros');
    // }
  };

  useEffect(() => {
    buscarRegistros();
  }, [pagina, limite, ordenacao, pesquisaIdNome, pesquisaIdUsuario, pesquisaCategoria, pesquisaBairro, pesquisaStatus]);


  return (
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
        <div className="col-12">
          <h2>Gerenciar registros</h2>
        </div>
      </div>

      {/* ---------------------- tabela ---------------------- */}
      <div className="row">

        {/*pesquisa e exportar*/}
        {/*<div className="col-12 my-2">*/}
        {/*  <label className="form-label">Pesquisar registros por ID, nome, email ou CPF</label>*/}
        {/*  <div className='d-flex gap-2'>*/}
        {/*    <input type="text"*/}
        {/*           className="form-control w-100"*/}
        {/*           placeholder="Pesquisar por ID, nome, email ou CPF"*/}
        {/*           onKeyUp={(event) => setTimeout(() => setTermo(event.target.value), 1000)}/>*/}
        {/*    <button className="btn btn-warning text-nowrap" onClick={exportarPDF}>Exportar PDF</button>*/}
        {/*  </div>*/}
        {/*</div>*/}

        {/*tabela*/}
        {/* #todo add text wrap and reduce the cell height */}
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
          paginationRowsPerPageOptions={[30, 70, 100]}
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

  );
}