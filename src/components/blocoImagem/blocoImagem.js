import React from 'react';
import {Button} from "react-bootstrap";

export default function BlocoImagem({imagem, onClick}) {
  return (
    <div style={{width: '120px', height: '160px'}} className=" d-flex flex-column">
      <img src={imagem} alt="" className="img-fluid mb-2 rounded" style={{objectFit: 'cover', width: '100px', height: '100px' }} />
      <Button variant="secondary" onClick={onClick}>Remover</Button>
    </div>
  )
}