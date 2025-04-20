import React from 'react';

export default function TextConclusaoProgramada({data}) {

  const dataAtual = new Date();
  const dataRegistro = new Date(data);
  const diasParaConcluir = Math.ceil((dataRegistro - dataAtual) / (1000 * 60 * 60 * 24));


  return (
    <div className='border rounded p-1 px-2 bg-dark-subtle flex-grow-1'>
      ⚠️ Conclusão em {diasParaConcluir} dias
    </div>
  )
}