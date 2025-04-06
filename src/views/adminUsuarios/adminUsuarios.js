import React, {useEffect, useState} from "react";
import PopupConfirmacao from "../../components/popupConfirmacao/popupConfirmacao";
import {mensagemErro} from "../../components/toastr";
import UsuarioService from "../../app/service/usuarioService";
import DataTable from "react-data-table-component";
import {jsPDF} from 'jspdf'
import {autoTable} from 'jspdf-autotable'

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

  const exportarPDF = async () => {
    // https://www.npmjs.com/package/jspdf-autotable

    try {
      const response = await service.buscarTodos(0, totalUsuarios, termo);
      const usuariosCompletos = response.data.usuarios;

      const doc = new jsPDF()
      const titulo = 'Relatório de Usuários';

      // itens da tabela
      const headers = colunas.map(coluna => coluna.name);
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

      doc.text(titulo, 14, 26);

      autoTable(doc, {
        head: [headers],
        body: dados,
        startY: 31,
        theme: 'grid',
        styles: {textColor: 0, overflow: 'linebreak', fontSize: 9},
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
      <div className="row mb-5">

        {/*pesquisa e exportar*/}
        <div className="col-12 my-2 d-flex gap-2">
          <input type="text"
                 className="form-control w-100"
                 placeholder="Pesquisar por ID, nome, email ou CPF"
                 onKeyUp={(event) => setTimeout(() => setTermo(event.target.value), 1000)}/>
          <button className="btn btn-warning text-nowrap" onClick={exportarPDF}>Exportar PDF</button>
        </div>

        {/*tabela*/}
        <DataTable
          columns={colunas}
          data={usuarios}
          fixedHeader
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