import React, {useState} from 'react';
import './iconeCrud.css';

export default function IconeCrud({icone: Icone, texto, cor, funcao}) {
const [isHovered, setIsHovered] = useState(false);
  return (
    <div className="d-flex icone-container clicavel border p-1 rounded bg-dark" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>

      <Icone
        className={`flex-shrink-0 icon-hover`}
        onClick={() => funcao}
        size={"25px"}
        style={{'color': `${isHovered ? cor : 'white'}`}}
      />

      <div className="mx-auto contagem-text text-white px-1">
        {texto}
      </div>

    </div>
  );
}