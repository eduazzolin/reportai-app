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
      <div className="d-flex botaoa flex-shrink-0 border p-1 rounded bg-danger-subtle" style={{'--hover-color': cor, 'background': isClicado ? cor : ''}}>


        <Icone
          className={`flex-shrink-0  icon-hover`}
          size={"26px"}
        />

        <div className="ms-1 contagem-text ">
          {contagem}
        </div>

      </div>
    </OverlayTrigger>
    // <OverlayTrigger
    //   placement="bottom"
    //   delay={{show: 50, hide: 50}}
    //   overlay={renderTooltip}
    // >
    //   <div className="d-inline-block position-relative">
    //
    //     {
    //       contagem > 0 ?
    //         <div className="contagem-circulo">
    //           {contagem}
    //         </div>
    //         : null
    //     }
    //
    //     <Icone
    //       className={`flex-shrink-0  icon-hover`}
    //       size={"26px"}
    //       style={{'--hover-color': cor, 'color': isClicado ? cor : ''}}
    //
    //     />
    //   </div>
    // </OverlayTrigger>
  )
    ;
}