import React, {useContext, useEffect, useState} from 'react';
import './cardRegistroLateralStyle.css'
import {BsArrowDownSquareFill, BsArrowUpSquareFill, BsCheckSquareFill, BsFillXSquareFill} from "react-icons/bs";
import IconeContagem from "../iconeContagem/iconeContagem";
import {mensagemAlerta, mensagemErro} from "../toastr";
import IconeMapa from "../iconeMapa/iconeMapa";
import TextConcluido from "../textConcluido/textConcluido";
import IconeCrud from "../iconeCrud/iconeCrud";
import {AuthContext} from "../../main/provedorAutenticacao";
import {useNavigate} from "react-router-dom";

export default function CardRegistroLateral({registro, focarMapaNoRegistro, interacaoService}) {

  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const [qtRelevante, setQtRelevante] = useState(0);
  const [qtIrrelevante, setQtIrrelevante] = useState(0);
  const [qtConcluido, setQtConcluido] = useState(0);
  const [usuarioInteracaoIdRelevante, setUsuarioInteracaoIdRelevante] = useState();
  const [usuarioInteracaoIdIrrelevante, setUsuarioInteracaoIdIrrelevante] = useState();
  const [usuarioInteracaoIdConcluido, setUsuarioInteracaoIdConcluido] = useState();


  const irParaRegistro = () => {
    window.open(`/registro/${registro.id}`, '_blank');
  };

  // a cada inicialização
  useEffect(() => {

    interacaoService
      .consultarRegistroSimples(registro.id)
      .then(response => {
        setQtRelevante(response.data.qtRelevante);
        setQtIrrelevante(response.data.qtIrrelevante);
        setQtConcluido(response.data.qtConcluido);
        setUsuarioInteracaoIdRelevante(response.data.usuarioInteracaoIdRelevante);
        setUsuarioInteracaoIdIrrelevante(response.data.usuarioInteracaoIdIrrelevante);
        setUsuarioInteracaoIdConcluido(response.data.usuarioInteracaoIdConcluido);
      }).catch(error => {
      mensagemErro(error?.response?.data?.descricao ?? 'Erro ao buscar interações.');
    });
  }, [registro]);

  function interagirRelevante() {

    if (!authContext.isAutenticado) {
      mensagemAlerta('Você precisa estar logado para interagir com os registros.');
      return;
    }

    if (usuarioInteracaoIdRelevante) {
      interacaoService
        .removerInteracao(usuarioInteracaoIdRelevante)
        .then(response => {
          setUsuarioInteracaoIdRelevante(null);
          setQtRelevante(qtRelevante - 1);
        }).catch(error => {
        mensagemErro(error?.response?.data?.descricao ?? 'Erro ao interagir.');
      });
    } else {
      interacaoService
        .interagir({tipo: 'RELEVANTE', registro})
        .then(response => {
          setUsuarioInteracaoIdRelevante(response.data.id);
          setQtRelevante(qtRelevante + 1);
        }).catch(error => {
        mensagemErro(error?.response?.data?.descricao ?? 'Erro ao interagir.');
      });
    }


  }

  function interagirIrrelevante() {
    if (!authContext.isAutenticado) {
      mensagemAlerta('Você precisa estar logado para interagir com os registros.');
      return;
    }

    if (usuarioInteracaoIdIrrelevante) {
      interacaoService
        .removerInteracao(usuarioInteracaoIdIrrelevante)
        .then(response => {
          setUsuarioInteracaoIdIrrelevante(null);
          setQtIrrelevante(qtIrrelevante - 1);
        }).catch(error => {
        mensagemErro(error?.response?.data?.descricao ?? 'Erro ao interagir.');
      });
    } else {
      interacaoService
        .interagir({tipo: 'IRRELEVANTE', registro})
        .then(response => {
          setUsuarioInteracaoIdIrrelevante(response.data.id);
          setQtIrrelevante(qtIrrelevante + 1);
        }).catch(error => {
        mensagemErro(error?.response?.data?.descricao ?? 'Erro ao interagir.');
      });
    }
  }

  function interagirConcluido() {
    if (!authContext.isAutenticado) {
      mensagemAlerta('Você precisa estar logado para interagir com os registros.');
      return;
    }

    if (usuarioInteracaoIdConcluido) {
      interacaoService
        .removerInteracao(usuarioInteracaoIdConcluido)
        .then(response => {
          setUsuarioInteracaoIdConcluido(null);
          setQtConcluido(qtConcluido - 1);
        }).catch(error => {
        mensagemErro(error?.response?.data?.descricao ?? 'Erro ao interagir.');
      });
    } else {
      interacaoService
        .interagir({tipo: 'CONCLUIDO', registro})
        .then(response => {
          setUsuarioInteracaoIdConcluido(response.data.id);
          setQtConcluido(qtConcluido + 1);
        }).catch(error => {
        mensagemErro(error?.response?.data?.descricao ?? 'Erro ao interagir.');
      });
    }
  }

  return (

    <div className={"container bg-light border rounded  shadow-sm"}>

      <div className="row p-2 overflow-hidden">

        {/*imagem*/}
        <div className="col-4 p-0 ">
          <div>
            {registro.imagens[0]?.caminho ? (
              <img src={registro.imagens[0].caminho} className="img_thumb rounded clicavel border" onClick={irParaRegistro} alt="..."/>
            ) : (
              <img src="/placeholder_registro.png" className="img_thumb rounded clicavel border" onClick={irParaRegistro} alt="..."/>
            )}
          </div>
        </div>

        {/*texto*/}
        <div className="col-8 ps-3">

          {/*titulo e localização*/}
          <div className="row">

            {/*cabeçalho*/}
            <div onClick={irParaRegistro} className="col-12 d-flex mb-3 mt-3 gap-2 clicavel div_titulo   overflow-hidden ">

              {/*icone*/}
              <img src={registro.categoria.icone} className="clicavel img_localizacao flex-shrink-0" alt="..."/>

              {/*titulo e localização*/}
              <div>
                <h5 className={"mb-0 text-nowrap text-truncate"}>{registro.titulo}</h5>
                <div className={"text_localizacao text-nowrap text-truncate"}>{registro.localizacao}</div>
              </div>

            </div>
          </div>

          {/*descrição*/}
          <div className="row div_descricao">
            <p className={"text_descricao"}>{registro.descricao}</p>
          </div>

          {/*usuario*/}
          <div className="row ">
            <div className="col-12 d-flex gap-1">
              <span className={"text-nowrap text-truncate fst-italic"}>- {registro.usuario.nome}</span>
            </div>
          </div>


          {/*botões*/}{/*https://react-icons.github.io/react-icons/*/}
          {/* ---------------------- botões ---------------------- */}
          {/*https://react-icons.github.io/react-icons/*/}
          <div className="row div_rodape align-items-end">

            {
              registro.isConcluido ?

                // CONCLUÍDO
                <div className="col-12 d-flex align-items-center justify-content-center justify-content-md-end gap-2 ">
                  <IconeMapa registro={registro} focarMapaNoRegistro={focarMapaNoRegistro}/>
                  <TextConcluido data={registro.dtConclusao}/>
                </div>

                :

                <div className="col-12 d-flex align-items-center justify-content-center justify-content-md-end gap-sm-2 ">
                  <IconeMapa registro={registro} focarMapaNoRegistro={focarMapaNoRegistro}/>
                  <IconeContagem
                    icone={BsArrowUpSquareFill}
                    contagem={qtRelevante}
                    cor={'#e6b000'}
                    isClicado={usuarioInteracaoIdRelevante}
                    interagir={interagirRelevante}
                    tooltip={'Relevante'}
                    tipo={'RELEVANTE'}
                  />
                  <IconeContagem
                    icone={BsArrowDownSquareFill}
                    contagem={qtIrrelevante}
                    cor={'rgba(243,93,63,0.82)'}
                    isClicado={usuarioInteracaoIdIrrelevante}
                    interagir={interagirIrrelevante}
                    tooltip={'Não relevante'}
                    tipo={'IRRELEVANTE'}
                  />
                  <IconeContagem
                    icone={BsCheckSquareFill}
                    contagem={qtConcluido}
                    cor={'rgba(65,195,20,0.82)'}
                    isClicado={usuarioInteracaoIdConcluido}
                    interagir={interagirConcluido}
                    tooltip={'Concluído'}
                    tipo={'CONCLUIDO'}
                  />
                </div>
            }
          </div>


        </div>
      </div>

    </div>)
}