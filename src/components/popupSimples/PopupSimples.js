import React from 'react';
import './PopupSimples.css';

export default function PopupSimples({ visivel, titulo, mensagem, fechar }) {
    if (!visivel) return null;

    return (
        <div className="modal-overlay">
            <div className="modal shadow mt-0 show" style={{ display: 'block' }} tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">{titulo}</h4>
                        </div>
                        <div className="modal-body">
                            <div dangerouslySetInnerHTML={{ __html: mensagem }} />
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={fechar}>Fechar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
