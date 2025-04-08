import React, {useEffect, useState} from "react";
import PopupConfirmacao from "../components/popupConfirmacao/popupConfirmacao";
import {mensagemErro, mensagemSucesso} from "../components/toastr";
import UsuarioService from "../app/service/usuarioService";
import DataTable from "react-data-table-component";
import {jsPDF} from 'jspdf'
import {autoTable} from 'jspdf-autotable'
import IconeCrud from "../components/iconeCrud/iconeCrud";
import {MdEditSquare} from "react-icons/md";
import IconeCrudSemTexto from "../components/iconeCrudSemTexto/iconeCrudSemTexto";
import {BsFillXSquareFill, BsFolderFill} from "react-icons/bs";
import {useNavigate} from "react-router-dom";

export default function AdminUsuarios() {
  /**
   * https://www.npmjs.com/package/react-data-table-component
   * https://www.youtube.com/watch?v=3oHUtG0cjfY&ab_channel=CodeWithYousaf
   * https://www.npmjs.com/package/jspdf-autotable
   *
   */

  const navigate = useNavigate();

  const [visibilidadePopupRemocao, setVisibilidadePopupRemocao] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [linhaSelecionada, setLinhaSelecionada] = useState();
  const [pagina, setPagina] = useState(0);
  const [limite, setLimite] = useState(10);
  const [totalUsuarios, setTotalUsuarios] = useState(0);
  const [termo, setTermo] = useState('');
  const [ordenacao, setOrdenacao] = useState('nome ASC');

  const service = new UsuarioService();

  const handleEditar = (linha) => {
    navigate('/minha-conta', {state: {idUsuario: linha.id}});
  }


  const handleRemover = (linha) => {
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
    console.log(pagina, limite, termo, ordenacao)
    service.buscarTodos(pagina, limite, termo, ordenacao)
      .then(response => {
        setUsuarios(response.data.usuarios);
        setTotalUsuarios(response.data.totalUsuarios);
        setPagina(response.data.pagina);
        console.log(response.data);
      }).catch(error => {
      mensagemErro(error?.response?.data?.descricao ?? 'Erro ao carregar usuários');
    });
  }

  const colunas = [
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
    },
    {
      name: 'Ações',
      cell: (row) => (
        <div className="d-flex gap-1">
          <IconeCrudSemTexto icone={BsFillXSquareFill} cor={'#D3310ED1'} funcao={() => handleRemover(row)} tooltip='Remover'/>
          <IconeCrudSemTexto icone={MdEditSquare} cor={'#bf9600'} funcao={() => handleEditar(row)} tooltip='Editar'/>
          <IconeCrudSemTexto icone={BsFolderFill} cor={'rgba(0,93,151,0.82)'} funcao={() => {
          }} tooltip='Registros'/>

        </div>
      ),
      grow: 2,
    },
  ]


  const exportarPDF = async () => {
    try {
      const response = await service.buscarTodos(0, totalUsuarios, termo);
      const usuariosCompletos = response.data.usuarios;

      const doc = new jsPDF()

      // itens da tabela
      const headers = colunas.filter(coluna => coluna.name !== 'Ações').map(coluna => coluna.name);
      const dados = usuariosCompletos.map(usuario => [
        usuario.id,
        usuario.nome,
        usuario.email,
        usuario.cpf,
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
          fontSize: 9
        },
        headStyles: {
          fillColor: [241, 197, 83],
          textColor: 0,
          fontStyle: 'bold',
          fontSize: 9,
          lineWidth: 0.2,
        },
        columnStyles: {
          0: {cellWidth: 13}, // Width for the first column
          1: {cellWidth: 39}, // Width for the second column
          2: {cellWidth: 37},
          3: {cellWidth: 26},
        }
      })

      // rodapé
      const totalPaginas = doc.internal.getNumberOfPages()
      for (let i = 1; i <= totalPaginas; i++) {
        if (i == 1) {
          continue
        }
        doc.setPage(i);
        doc.setFontSize(10);
        doc.text(`Página ${i} de ${totalPaginas}`, 15, 285);
      }

      // salva o PDF
      doc.save('usuarios.pdf');

    } catch (error) {
      console.log(error);
      mensagemErro(error?.response?.data?.descricao ?? 'Erro ao exportar usuários');
    }
  };

  useEffect(() => {
    buscarUsuarios();
  }, [termo, pagina, limite, ordenacao]);


  return (
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
        <div className="col-12">
          <h2>Gerenciar usuários</h2>
        </div>
      </div>

      {/* ---------------------- tabela ---------------------- */}
      <div className="row">

        {/*pesquisa e exportar*/}
        <div className="col-12 my-2">
          <label className="form-label">Pesquisar usuários por ID, nome, email ou CPF</label>
          <div className='d-flex gap-2'>
            <input type="text"
                   className="form-control w-100"
                   placeholder="Pesquisar por ID, nome, email ou CPF"
                   onKeyUp={(event) => setTimeout(() => setTermo(event.target.value), 1000)}/>
            <button className="btn btn-warning text-nowrap" onClick={exportarPDF}>Exportar PDF</button>
          </div>
        </div>

        {/*tabela*/}
        {/* #todo add text wrap and reduce the cell height */}
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

  );
}