import React, {useEffect, useState} from "react";
import {useNavigate} from 'react-router-dom';
import {mensagemErro, mensagemSucesso} from "../components/toastr";
import PopupConfirmacao from "../components/popupConfirmacao/popupConfirmacao";
import {RegistroService} from "../app/service/registroService";
import CardRegistroMeusRegistros from "../components/cardRegistroMeusRegistros/cardRegistroMeusRegistros";
import Pagination from 'react-bootstrap/Pagination';

export default function MeusRegistros() {

  const navigate = useNavigate();

  const [pagina, setPagina] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [visibilidadePopupRemocao, setVisibilidadePopupRemocao] = useState(false);
  const [visibilidadePopupConclusao, setVisibilidadePopupConclusao] = useState(false);
  const [registros, setRegistros] = useState([]);
  const [registroSelecionado, setRegistroSelecionado] = useState(null);

  const service = new RegistroService();

  /**
   * Carrega o título da página
   */
  useEffect(() => {
    document.title = 'Reportaí - Meus Registros';
  }, []);

  /**
   * Abre o popup de remoção de registro e seta o registro selecionado.
   * @param idRegistro
   */
  const abrirPopupRemocao = (idRegistro) => {
    setVisibilidadePopupRemocao(true)
    setRegistroSelecionado(idRegistro)
  }

  /**
   * Abre o popup de conclusão de registro e seta o registro selecionado.
   * @param idRegistro
   */
  const abrirPopupConclusao = (idRegistro) => {
    setVisibilidadePopupConclusao(true)
    setRegistroSelecionado(idRegistro)
  }

  /**
   * Ignora a conclusão automática de um registro e recarrega os registros.
   * @param idRegistro
   */
  const handleIgnorarConclusao = (idRegistro) => {
    service
      .ignorarConclusao(idRegistro)
      .then(response => {
        mensagemSucesso("Conclusão programada ignorada com sucesso!");
        loadRegistros()
      }).catch(error => {
      mensagemErro(error?.response?.data?.descricao ?? 'Erro ao ignorar conclusão');
    });
  }

  /**
   * Remove o registro selecionado e recarrega os registros.
   */
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

  /**
   * Conclui o registro selecionado e recarrega os registros.
   */
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

  /**
   * Carrega os registros do usuário logado na página.
   */
  const loadRegistros = () => {
    service
      .consultarMeusRegistros(pagina, 10)
      .then(response => {
        setRegistros(response.data.registros);
        setTotalPaginas(response.data.totalPaginas);
        setPagina(response.data.pagina);
        console.log(response.data);
      }).catch(error => {
      mensagemErro(error?.response?.data?.descricao ?? 'Erro ao buscar registros');
    });
  }

  /**
   * A cada mudança de página, carrega os registros.
   */
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
        onCancel={() => setVisibilidadePopupRemocao(false)}
      />
      <PopupConfirmacao
        visivel={visibilidadePopupConclusao}
        titulo="Concluir registro"
        mensagem="Tem certeza que deseja concluir o registro? Não é possível desfazer esta ação."
        onConfirm={handleConcluir}
        onCancel={() => setVisibilidadePopupConclusao(false)}
      />

      {/* ---------------------- titulo ---------------------- */}
      <div className="row mt-3">
        <div className="col-12">
          <h2>Meus registros</h2>
        </div>
      </div>

      {/* ---------------------- cards ---------------------- */}
      <div className="row ">
        {
          registros.map((registro, index) => (
            <div key={index} className={'p-2 col-lg-6'}>
              <CardRegistroMeusRegistros
                key={index}
                registro={registro}
                funcaoRemover={abrirPopupRemocao}
                funcaoConcluir={abrirPopupConclusao}
                funcaoIgnorarConclusao={handleIgnorarConclusao}
              />
            </div>
          ))
        }
      </div>

      {/* ---------------------- paginação ---------------------- */}
      <div className="row">
        <div className='col-12 d-flex justify-content-center pt-3'>
          <Pagination>

            {/*botão voltar*/}
            {
              pagina > 0 &&
              <Pagination.Prev onClick={() => setPagina(pagina - 1)}/>
            }

            {/*páginas*/}
            {
              [...Array(totalPaginas)].map((_, index) => (
                <Pagination.Item key={index} active={index === pagina} onClick={() => setPagina(index)}>
                  {index + 1}
                </Pagination.Item>
              ))
            }

            {/*botão avançar*/}
            {
              pagina < totalPaginas - 1 &&
              <Pagination.Next onClick={() => setPagina(pagina + 1)}/>
            }
          </Pagination>

        </div>
      </div>

      {
        registros.length > 0 ? '' :
          <div className={'row p-3 h-50'}>
            <div className="col-12 d-flex flex-column justify-content-center align-items-center text-center">
              <span className="fs-2">ℹ️</span>
              <p className="mt-2 mb-1">Nenhum registro encontrado!</p>
              <p>
                Experimente{' '}
                <a className="clicavel" onClick={() => navigate('/cadastrar-registro')}>
                  criar um novo registro
                </a>.
              </p>
            </div>

          </div>
      }

    </div>

  )
}