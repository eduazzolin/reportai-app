import React from 'react';
import './cardRegistroLateralStyle.css'
import {FaSquareCheck} from "react-icons/fa6";
import {FaMap} from "react-icons/fa";
import {AiFillLike} from "react-icons/ai";
import {ReactSVG} from "react-svg";

export default function CardRegistroLateral({registro, focarMapaNoRegistro}) {
  const handleTitleClick = () => {
    window.open(`/registro/${registro.id}`, '_blank');
  };
  return (<div className={"container card_container bg-light border rounded"}>
    <div className="row p-2">

      <div className="col-4 p-0">
        <div>
          <img src={registro.imagens[0].caminho} className="img_thumb rounded" alt="..."/>
        </div>
      </div>

      <div className="col-8 ps-3">
        <div className="container p-0">
          <div className="row">

            <div onClick={handleTitleClick} className="col-12 d-flex mb-3 mt-3 gap-2 clicavel div_titulo">
              <img src={registro.categoria.icone} className="teste" alt="..."/>
              <div>
                <h5 className={"text_titulo "}>{registro.titulo}</h5>
                <div className={"text_localizacao"}>{registro.localizacao}</div>
              </div>
            </div>

            <div className="col-12 div_body">
              <p className={"text_descricao"}>{registro.descricao}</p>
              <div className="col-12 gap-2 d-flex justify-content-between align-items-center">
                <div className={"div_usuario"}>
                  <img src={registro.usuario.foto} className="img_usuario" alt="..."/>
                  <span className={"text_usuario"}>{registro.usuario.nome}</span>
                </div>
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
    </div>

  </div>)
}