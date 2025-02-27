import React from "react";
import {Button} from "react-bootstrap";
import {mensagemAlerta, mensagemErro, mensagemSucesso} from "../components/toastr";

export default function Sandbox() {
  return (
    <div className='container'>
      <Button variant="success" className={'w-100'} onClick={() => mensagemSucesso('sucesso')}>Testar toastr sucesso</Button>
      <Button variant="danger" className={'w-100'} onClick={() => mensagemErro('erro')}>Testar toastr erro</Button>
      <Button variant="warning" className={'w-100'} onClick={() => mensagemAlerta('alerta')}>Testar toastr info</Button>
    </div>)
}
