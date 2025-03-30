import React from 'react';
import './cardRegistroLateralStyle.css'
import {FaMap, FaUserCircle} from "react-icons/fa";
import {BsArrowDownSquareFill, BsArrowUpSquareFill, BsCheckSquareFill} from "react-icons/bs";

export default function CardRegistroLateral({registro, focarMapaNoRegistro}) {

  const goToRegistro = () => {
    window.open(`/registro/${registro.id}`, '_blank');
  };

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


          <div className="row div_rodape align-items-end">

            {/*usuario*/}
            <div className="col-md-8 d-flex gap-1">
              <FaUserCircle size="26px" className="flex-shrink-0"/>
              <span className={"text-nowrap text-truncate"}>{registro.usuario.nome}</span>
            </div>

            {/*botões*/}{/*https://react-icons.github.io/react-icons/*/}
            <div className="col-md-4 d-flex justify-content-center justify-content-md-end gap-1">
              <FaMap className='clicavel flex-shrink-0' onClick={() => focarMapaNoRegistro(registro)} size={"26px"}/>
              <BsArrowUpSquareFill className='flex-shrink-0 clicavel-azul' size={"26px"}/>
              <BsArrowDownSquareFill className='flex-shrink-0 clicavel-vermelho' size={"26px"}/>
              <BsCheckSquareFill className='flex-shrink-0 clicavel-verde' size={"26px"}/>
            </div>

          </div>


        </div>
      </div>

    </div>)
}