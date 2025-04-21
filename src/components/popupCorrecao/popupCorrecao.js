import React from 'react';
import './PopupCorrecao.css';

export default function PopupCorrecao({visivel, tipo, textoCorrigido, abrirRegrasPublicacao, onAceitar, onRejeitar}) {
  if (!visivel) return null;
  const textoCorrigidoTratado = textoCorrigido.replaceAll(/\n/g, '<br />').replaceAll('<correcao>', '<mark>').replaceAll('</correcao>', '</mark>');
  return (
    <div className="modal-overlay">
      <div className="modal shadow mt-2 show" style={{display: 'block'}} tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">

            {/*cabeçalho*/}
            <div className="modal-header">
              <h4 className="modal-title">💡Que tal este ajuste {tipo === 'titulo' ? 'no título' : tipo === 'descricao' ? 'na descrição' : ''}?</h4>
            </div>

            {/*corpo*/}
            <div className="modal-body p-3">

              <div className="mb-3">
                Detectamos um possível ajuste no texto para se adequar melhor às <a onClick={abrirRegrasPublicacao} className='clicavel'>regras de publicação</a>.
              </div>

              <div className="border rounded p-3">

                <div className="mb-3">
                  <strong>Texto Corrigido:</strong>
                </div>

                <div className="overflow-auto" style={{maxHeight: '300px'}}>
                  <div dangerouslySetInnerHTML={{__html: textoCorrigidoTratado}}/>
                </div>

              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onRejeitar}>Editar manualmente</button>
              <button type="button" className="btn btn-primary" onClick={onAceitar}>Aceitar correção</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
