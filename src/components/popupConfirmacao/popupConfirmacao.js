import React from 'react';
import './PopupConfirmacao.css'; // Importe o CSS do modal

export default function PopupConfirmacao({ visivel, titulo, mensagem, onCancel, onConfirm }) {
    if (!visivel) return null;

    return (
        <div className="modal-overlay">
            <div className="modal shadow mt-5 show" style={{ display: 'block' }} tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">{titulo}</h4>
                        </div>
                        <div className="modal-body">
                            {mensagem}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-danger" onClick={onConfirm}>Sim</button>
                            <button type="button" className="btn btn-secondary" onClick={onCancel}>Não</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
