import React from 'react';

export default function TextConcluido({data}) {
  return (
    <div className='border rounded p-1 px-2 bg-dark-subtle'>
      ✅ Concluído em {new Date(data).toLocaleDateString()}
    </div>
  )
}