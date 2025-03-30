import React from 'react';
import './iconeContagem.css';

export default function IconeContagem({icone: Icone, contagem, isClicado, setClicado, cor, acao1, acao2}) {


  return (
    <div>
      {contagem}
      <Icone
        className={`flex-shrink-0 clicavel icon-hover `}
        size={"26px"}
        style={{'--hover-color': cor}}
      />
    </div>
  );
}