import React from 'react';
import './iconeContagem.css';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

export default function IconeContagem({icone: Icone, contagem, isClicado, tooltip, setClicado, cor, acao1, acao2}) {

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      {tooltip}
    </Tooltip>
  );


  return (
    <OverlayTrigger
      placement="bottom"
      delay={{show: 50, hide: 50}}
      overlay={renderTooltip}
    >
      <div className="d-flex container-botao flex-shrink-0 border p-1 rounded">

        <Icone
          className={`flex-shrink-0  icon-hover `}
          size={"26px"}
          style={{ '--hover-color': cor, 'color': isClicado ? cor : '' }}
        />

        <div className="mx-auto contagem-text text-white ">
          {contagem}
        </div>

      </div>
    </OverlayTrigger>
  )
    ;
}