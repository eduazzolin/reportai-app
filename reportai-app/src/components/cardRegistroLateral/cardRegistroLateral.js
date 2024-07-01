import React from 'react';
import './cardRegistroLateralStyle.css'
import {BsFillGeoAltFill, BsCheckSquare} from "react-icons/bs";
import {BiLike} from "react-icons/bi";

export default function CardRegistroLateral({registro}) {
  return (<div className={"container card_container bg-light border rounded"}>
    <div className="row p-2">

      <div className="col-4 p-0">
        <div>
          <img src={registro.imagens[0].url} className="img_thumb rounded" alt="..."/>
        </div>
      </div>

      <div className="col-8 ps-3">
        <div className="container p-0">
          <div className="row">

            <div className="col-12 d-flex align-items-center mb-2 gap-1">
              <div className="icone_localizacao">
                <BsFillGeoAltFill size={"20px"}/>
              </div>
              <div className={"text_localizacao"}>{registro.localizacao}</div>
            </div>

            <div className="col-12">
              <h5 className={"text_titulo"}>{registro.titulo}</h5>
            </div>

            <div className="col-12">
              <p className={"text_descricao"}>{registro.descricao}</p>
            </div>

            <div className="col-12 gap-2 d-flex justify-content-between align-items-center">
              <div className={"div_usuario"}>
                <img src={registro.usuario.foto} className="img_usuario" alt="..."/>
                <span className={"text_usuario"}>{registro.usuario.nome}</span>
              </div>
              <div>
              <BiLike size={"26px"}/><BsCheckSquare size={"26px"}/>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>

  </div>)
}