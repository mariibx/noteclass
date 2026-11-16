
import {
  Star,
  Trash2,
  Archive,
  Pencil
} from 'lucide-react';

import './NoteCard.css';

function NoteCard({
  note,
  onEdit,
  onDelete,
  onToggleFavorite,
  onArchive
}) {

  // Converter o conteúdo HTML em texto simples
  function getPreview(content) {
    const temporaryElement = document.createElement('div');

    temporaryElement.innerHTML = content || '';

    return temporaryElement.textContent || '';
  }

  // Cor personalizada da categoria
  const categoryColor = note.categoryColor || '#8872C7';

  return (
    <article className="note-card">

      {/* Cabeçalho */}
      <div className="note-card-header">

        <span
          className="note-category"
          style={{
            backgroundColor: `${categoryColor}25`,
            color: categoryColor,
            borderColor: `${categoryColor}55`
          }}
        >
          {note.categoryName || 'Sem categoria'}
        </span>

        <button
          className={`note-favorite ${
            note.favorite ? 'favorited' : ''
          }`}
          onClick={() => onToggleFavorite(note.id)}
          aria-label="Alternar favorito"
          title="Favoritar"
        >
          <Star
            size={18}
            fill={note.favorite ? 'currentColor' : 'none'}
          />
        </button>

      </div>

      {/* Conteúdo */}
      <button
        className="note-card-content"
        onClick={() => onEdit(note)}
      >

        <h3>
          {note.title || 'Sem título'}
        </h3>

        <p>
          {getPreview(note.content).slice(0, 130) ||
            'Anotação sem conteúdo.'}
        </p>

      </button>

      {/* Rodapé */}
      <div className="note-card-footer">

        <span>
          {note.updatedAt
            ? new Date(note.updatedAt).toLocaleDateString('pt-BR')
            : ''}
        </span>

        <div className="note-actions">

          <button
            onClick={() => onEdit(note)}
            aria-label="Editar anotação"
            title="Editar"
          >
            <Pencil size={16} />
          </button>

          <button
            onClick={() => onArchive(note.id)}
            aria-label="Arquivar anotação"
            title="Arquivar"
          >
            <Archive size={16} />
          </button>

          <button
            onClick={() => onDelete(note.id)}
            aria-label="Excluir anotação"
            title="Excluir"
          >
            <Trash2 size={16} />
          </button>

        </div>

      </div>

    </article>
  );
}

export default NoteCard;
