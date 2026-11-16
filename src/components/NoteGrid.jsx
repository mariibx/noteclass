
import { FileText } from 'lucide-react';
import NoteCard from './NoteCard';
import './NoteGrid.css';

function NoteGrid({
  notes,
  onEdit,
  onDelete,
  onToggleFavorite,
  onArchive
}) {
  if (notes.length === 0) {
    return (
      <div className="empty-notes">
        <FileText size={42} />

        <h2>Nenhuma anotação encontrada</h2>

        <p>Crie sua primeira anotação para começar a organizar seus estudos.</p>
      </div>
    );
  }

  return (
    <div className="note-grid">
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleFavorite={onToggleFavorite}
          onArchive={onArchive}
        />
      ))}
    </div>
  );
}

export default NoteGrid;
