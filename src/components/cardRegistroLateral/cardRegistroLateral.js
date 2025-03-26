import React from 'react';
import './cardRegistroLateralStyle.css'
import {FaSquareCheck} from "react-icons/fa6";
import {FaMap, FaUserCircle} from "react-icons/fa";
import {AiFillLike} from "react-icons/ai";
import {ReactSVG} from "react-svg";

export default function CardRegistroLateral({registro, focarMapaNoRegistro}) {

  const goToRegistro = () => {
    window.open(`/registro/${registro.id}`, '_blank');
  };

  return (

    <div className={"container card_container bg-light border rounded"}>

      <div className="row p-2 overflow-hidden">

        {/*imagem*/}
        <div className="col-4 p-0">
          <div>
            {registro.imagens[0]?.caminho && <img src={registro.imagens[0].caminho} className="img_thumb rounded clicavel" onClick={goToRegistro} alt="..."/>}
          </div>
        </div>

        {/*texto*/}
        <div className="col-8 ps-3">

          <div className="row ">

            {/*cabeçalho*/}
            <div onClick={goToRegistro} className="col-12 d-flex mb-3 mt-3 gap-2 clicavel div_titulo   overflow-hidden ">

              {/*icone*/}
              <img src={registro.categoria.icone} className="clicavel" alt="..."/>

              {/*titulo e localização*/}
              <div>
                <h5 className={"text_titulo mb-0"}>{registro.titulo}</h5>
                <div className={"text_localizacao"}>{registro.localizacao}</div>
              </div>

            </div>

            {/*body*/}
            <div className="col-12 div_body">

              {/*descrição*/}
              <p className={"text_descricao"}>{registro.descricao}</p>

              <div className="col-12 gap-2 d-flex justify-content-between align-items-center">

                {/*usuario*/}
                <div className={"div_usuario"}>
                  <FaUserCircle className="img_usuario" size="26px"/>
                  <span className={"text_usuario"}>{registro.usuario.nome}</span>
                </div>

                {/*botões*/}
                <div className='gap-2 d-flex'>
                  <FaMap className='clicavel' onClick={() => focarMapaNoRegistro(registro)} size={"26px"}/>
                  <AiFillLike size={"26px"}/>
                  <FaSquareCheck size={"26px"}/>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>

    </div>)
}