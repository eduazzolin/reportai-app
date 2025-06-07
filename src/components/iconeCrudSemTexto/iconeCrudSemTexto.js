import React, {useState} from 'react';
import '../iconeCrud/iconeCrud.css';
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

// https://react-icons.github.io/react-icons/
export default function IconeCrudSemTexto({icone: Icone, cor, funcao, tooltip, size = '16px'}) {
  const [isHovered, setIsHovered] = useState(false);

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
      <div
        className="d-flex clicavel border rounded bg-dark-subtle p-1"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={funcao}
      >

        <Icone
          className={`flex-shrink-0 icon-hover my-auto`}

          size={size}
          style={{'color': `${isHovered ? cor : 'black'}`}}
        />

      </div>
    </OverlayTrigger>
  );
}