import React from 'react';
import {FaMap} from "react-icons/fa";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

export default function IconeMapa({registro, focarMapaNoRegistro}) {

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Mostrar no mapa
    </Tooltip>
  );

  return (
    <OverlayTrigger
      placement="bottom"
      delay={{show: 50, hide: 50}}
      overlay={renderTooltip}
    >
      <div>
        <FaMap className='clicavel flex-shrink-0' onClick={() => focarMapaNoRegistro(registro)} size={"26px"}/>
      </div>
    </OverlayTrigger>
  )
}