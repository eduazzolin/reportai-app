import React, {useState} from 'react';
import './iconeCrud.css';

export default function IconeCrud({icone: Icone, texto, cor, funcao}) {
const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      className="d-flex icone-container clicavel border p-1 rounded bg-dark-subtle flex-grow-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={funcao}
    >

      <Icone
        className={`flex-shrink-0  icon-hover`}

        size={"25px"}
        style={{'color': `${isHovered ? cor : 'black'}`}}
      />

      <div className="mx-auto contagem-text  px-1">
        {texto}
      </div>

    </div>
  );
}