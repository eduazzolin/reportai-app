import React, {useEffect, useState} from 'react';
import './cardRegistroLateralStyle.css'
import {FaMap, FaUserCircle} from "react-icons/fa";
import {BsArrowDownSquareFill, BsArrowUpSquareFill, BsCheckSquareFill} from "react-icons/bs";
import IconeContagem from "../iconeContagem/iconeContagem";
import {mensagemErro} from "../toastr";
import IconeMapa from "../iconeMapa/iconeMapa";

export default function CardRegistroLateral({registro, focarMapaNoRegistro, interacaoService}) {

  const goToRegistro = () => {
    window.open(`/registro/${registro.id}`, '_blank');
  };

  const [qtRelevante, setQtRelevante] = useState(0);
  const [qtIrrelevante, setQtIrrelevante] = useState(0);
  const [qtConcluido, setQtConcluido] = useState(0);
  const [usuarioMarcouRelevante, setUsuarioMarcouRelevante] = useState(false);
  const [usuarioMarcouIrrelevante, setUsuarioMarcouIrrelevante] = useState(false);
  const [usuarioMarcouConcluido, setUsuarioMarcouConcluido] = useState(false);

  // a cada inicialização
  useEffect(() => {

    interacaoService
      .consultarRegistroSimples(registro.id)
      .then(response => {
        console.log(response.data);
        setQtRelevante(response.data.qtRelevante);
        setQtIrrelevante(response.data.qtIrrelevante);
        setQtConcluido(response.data.qtConcluido);
        setUsuarioMarcouRelevante(response.data.usuarioMarcouRelevante);
        setUsuarioMarcouIrrelevante(response.data.usuarioMarcouIrrelevante);
        setUsuarioMarcouConcluido(response.data.usuarioMarcouConcluido);
      }).catch(error => {
      mensagemErro(error?.response?.data?.descricao ?? 'Erro ao buscar interações.');
    });
  }, [registro]);

  return (

    <div className={"container bg-light border rounded"}>

      <div className="row p-2 overflow-hidden">

        {/*imagem*/}
        <div className="col-4 p-0">
          <div>
            {registro.imagens[0]?.caminho && <img src={registro.imagens[0].caminho} className="img_thumb rounded clicavel" onClick={goToRegistro} alt="..."/>}
          </div>
        </div>

        {/*texto*/}
        <div className="col-8 ps-3">

          {/*titulo e localização*/}
          <div className="row">

            {/*cabeçalho*/}
            <div onClick={goToRegistro} className="col-12 d-flex mb-3 mt-3 gap-2 clicavel div_titulo   overflow-hidden ">

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
          <div className="row div_rodape align-items-end">
            <div className="col-12 d-flex align-items-center justify-content-center justify-content-md-end gap-2 ">
              <IconeMapa registro={registro} focarMapaNoRegistro={focarMapaNoRegistro}/>
              <IconeContagem icone={BsArrowUpSquareFill} contagem={qtRelevante} cor={'#e6b000'} isClicado={usuarioMarcouRelevante} tooltip={'Relevante'}/>
              <IconeContagem icone={BsArrowDownSquareFill} contagem={qtIrrelevante} cor={'rgba(243,93,63,0.82)'} isClicado={usuarioMarcouIrrelevante} tooltip={'Não relevante'}/>
              <IconeContagem icone={BsCheckSquareFill} contagem={qtConcluido} cor={'rgba(65,195,20,0.82)'} isClicado={usuarioMarcouConcluido} tooltip={'Concluído'}/>
            </div>

          </div>


        </div>
      </div>

    </div>)
}