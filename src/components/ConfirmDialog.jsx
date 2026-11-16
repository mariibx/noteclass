
import { AlertTriangle, Trash2, X } from 'lucide-react';
import './ConfirmDialog.css';

function ConfirmDialog({ note, onCancel, onConfirm }) {
  if (!note) return null;

  return (
    <div
      className="dialog-overlay"
      onClick={onCancel}
    >
      <section
        className="confirm-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-description"
        onClick={(event) => event.stopPropagation()}
      >

        <button
          className="dialog-close"
          onClick={onCancel}
          aria-label="Fechar janela"
        >
          <X size={19} />
        </button>

        <div className="dialog-icon">
          <AlertTriangle size={27} />
        </div>

        <h2 id="confirm-title">
          Excluir anotação?
        </h2>

        <p id="confirm-description">
          Tem certeza de que deseja excluir esta anotação?
          Essa ação não poderá ser desfeita.
        </p>

        <div className="dialog-note-preview">
          <span>ANOTAÇÃO SELECIONADA</span>
          <strong>{note.title || 'Sem título'}</strong>
        </div>

        <div className="dialog-actions">
          <button
            className="dialog-cancel"
            onClick={onCancel}
          >
            Cancelar
          </button>

          <button
            className="dialog-confirm"
            onClick={onConfirm}
          >
            <Trash2 size={17} />
            Excluir anotação
          </button>
        </div>

      </section>
    </div>
  );
}

export default ConfirmDialog;
