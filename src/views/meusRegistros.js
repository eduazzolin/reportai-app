import React, {useEffect, useState} from "react";
import {useNavigate} from 'react-router-dom';
import {usuarioPrototype} from "../app/service/usuarioService";
import {mensagemErro, mensagemSucesso} from "../components/toastr";
import PopupConfirmacao from "../components/popupConfirmacao/popupConfirmacao";
import {RegistroService} from "../app/service/registroService";
import CardRegistroMeusRegistros from "../components/cardRegistroMeusRegistros/cardRegistroMeusRegistros";
import Pagination from 'react-bootstrap/Pagination';

export default function MeusRegistros() {

  const [usuario, setUsuario] = useState(usuarioPrototype);
  const [pagina, setPagina] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [visibilidadePopupRemocao, setVisibilidadePopupRemocao] = useState(false);
  const [visibilidadePopupConclusao, setVisibilidadePopupConclusao] = useState(false);
  const [registros, setRegistros] = useState([]);
  const [registroSelecionado, setRegistroSelecionado] = useState(null);
  const navigate = useNavigate();

  const service = new RegistroService();

  useEffect(() => {
    document.title = 'Reportaí - Meus Registros';
  }, []);

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
      .consultarMeusRegistros(pagina, 9)
      .then(response => {
        setRegistros(response.data.registros);
        setTotalPaginas(response.data.totalPaginas);
        setPagina(response.data.pagina);
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
      <div className="row mr_div_registros overflow-y-scroll">
        {
          registros.map((registro, index) => (
            <div key={index} className={'p-2 col-md-6'}>
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

    </div>

  )
}