import React, {useEffect, useState} from 'react';
import './cardRegistroMeusRegistros.css'
import {BsArrowDownSquareFill, BsArrowUpSquareFill, BsCheckSquareFill, BsFillXSquareFill} from "react-icons/bs";
import IconeCrud from "../iconeCrud/iconeCrud";
import {mensagemErro} from "../toastr";
import IconeMapa from "../iconeMapa/iconeMapa";
import {MdDeleteForever, MdEditSquare, MdModeEdit} from "react-icons/md";
import TextConcluido from "../textConcluido/textConcluido";

export default function CardRegistroMeusRegistros({registro, funcaoRemover, funcaoConcluir}) {

  const goToRegistro = () => {
    window.open(`/registro/${registro.id}`, '_blank');
  };


  return (

    <div className={"container bg-light border rounded shadow-sm"}>

      <div className="row p-2 overflow-hidden">

        {/* ---------------------- imagens ---------------------- */}
        <div className="col-4 p-0 ">
          <div>
            {registro.imagens[0]?.caminho && <img src={registro.imagens[0].caminho} className="mr_img_thumb rounded clicavel" onClick={goToRegistro} alt="..."/>}
          </div>
        </div>

        {/* ---------------------- texto ---------------------- */}
        <div className="col-8 ps-3">

          {/*titulo e localização*/}
          <div className="row">

            {/*cabeçalho*/}
            <div onClick={goToRegistro} className="col-12 d-flex mb-3 mt-2 gap-2 clicavel div_titulo   overflow-hidden ">

              {/*icone*/}
              <img src={registro.categoria.icone} className="clicavel mr_img_localizacao flex-shrink-0" alt="..."/>

              {/*titulo e localização*/}
              <div>
                <h5 className={"mb-0 text-nowrap text-truncate"}>{registro.titulo}</h5>
                <div className={"mr_text_localizacao text-nowrap text-truncate"}>{registro.localizacao}</div>
              </div>

            </div>
          </div>

          {/*descrição*/}
          <div className="row mr_div_descricao">
            <p className={"mr_text_descricao"}>{registro.descricao}</p>
          </div>

        </div>
      </div>

      {/* ---------------------- botões ---------------------- */}
      {/*https://react-icons.github.io/react-icons/*/}

      {
        registro.isConcluido ?

          // CONCLUÍDO
          <div className="row pb-2">
            <div className="col-12 d-flex align-items-center justify-content-center justify-content-md-end gap-2 ">

              <TextConcluido data={registro.dtConclusao}/>

              <IconeCrud
                icone={BsFillXSquareFill}
                texto={'Remover'}
                cor={'rgba(243,93,63,0.82)'}
                funcao={() => funcaoRemover(registro.id)}
              />
            </div>
          </div>

          :

          // ATIVO
          <div className="row pb-2">
            <div className="col-12 d-flex align-items-center justify-content-center justify-content-md-end gap-2 ">
              <IconeCrud
                icone={MdEditSquare}
                texto={'Editar'}
                cor={'#e6b000'}
              />
              <IconeCrud
                icone={BsFillXSquareFill}
                texto={'Remover'}
                cor={'rgba(243,93,63,0.82)'}
                funcao={() => funcaoRemover(registro.id)}
              />
              <IconeCrud
                icone={BsCheckSquareFill}
                texto={'Concluir'}
                cor={'rgba(65,195,20,0.82)'}
                funcao={() => funcaoConcluir(registro.id)}
              />
            </div>
          </div>

      }

    </div>)
}