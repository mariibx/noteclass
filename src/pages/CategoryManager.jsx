import { useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  Tag,
  X,
  AlertTriangle
} from 'lucide-react';

import './CategoryManager.css';

const categoryColors = [
  '#8872C7',
  '#5B8DEF',
  '#42A88A',
  '#E6A34A',
  '#E47783',
  '#8B95A5',
  '#B47BC5',
  '#3D9EAD'
];

function CategoryManager({ categories, notes, onSave, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const [name, setName] = useState('');
  const [color, setColor] = useState(categoryColors[0]);

  function openNewCategory() {
    setEditingCategory(null);
    setName('');
    setColor(categoryColors[0]);
    setShowForm(true);
  }

  function openEditCategory(category) {
    setEditingCategory(category);
    setName(category.name);
    setColor(category.color);
    setShowForm(true);
  }

  function handleSave(event) {
    event.preventDefault();

    if (!name.trim()) return;

    onSave({
      id: editingCategory?.id || crypto.randomUUID(),
      name: name.trim(),
      color
    });

    setShowForm(false);
    setEditingCategory(null);
    setName('');
  }

  function confirmDelete() {
    if (!categoryToDelete) return;

    onDelete(categoryToDelete.id);
    setCategoryToDelete(null);
  }

  return (
    <div className="category-page">

      <header className="category-header">
        <div>
          <h2>Minhas categorias</h2>
          <p>Organize suas anotações por disciplinas e assuntos.</p>
        </div>

        <button
          className="category-create-button"
          onClick={openNewCategory}
        >
          <Plus size={18} />
          Nova categoria
        </button>
      </header>

      {categories.length === 0 ? (

        <div className="category-empty">
          <Tag size={40} />
          <h3>Nenhuma categoria criada</h3>
          <p>Crie categorias para organizar melhor seus estudos.</p>

          <button
            className="category-create-button"
            onClick={openNewCategory}
          >
            <Plus size={18} />
            Criar primeira categoria
          </button>
        </div>

      ) : (

        <div className="category-grid">

          {categories.map(category => {
            const noteCount = notes.filter(
              note => note.categoryId === category.id
            ).length;

            return (
              <article
                className="category-card"
                key={category.id}
              >
                <div
                  className="category-color"
                  style={{ backgroundColor: category.color }}
                >
                  <Tag size={23} color="#FFFFFF" />
                </div>

                <div className="category-info">
                  <h3>{category.name}</h3>
                  <p>
                    {noteCount} {noteCount === 1 ? 'anotação' : 'anotações'}
                  </p>
                </div>

                <div className="category-actions">
                  <button
                    onClick={() => openEditCategory(category)}
                    aria-label={`Editar ${category.name}`}
                    title="Editar categoria"
                  >
                    <Pencil size={17} />
                  </button>

                  <button
                    onClick={() => setCategoryToDelete(category)}
                    aria-label={`Excluir ${category.name}`}
                    title="Excluir categoria"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </article>
            );
          })}

        </div>
      )}

      {/* Formulário de criação e edição */}
      {showForm && (
        <div
          className="category-overlay"
          onClick={() => setShowForm(false)}
        >
          <form
            className="category-dialog"
            onSubmit={handleSave}
            onClick={event => event.stopPropagation()}
          >
            <button
              type="button"
              className="category-close"
              onClick={() => setShowForm(false)}
              aria-label="Fechar"
            >
              <X size={19} />
            </button>

            <h2>
              {editingCategory ? 'Editar categoria' : 'Nova categoria'}
            </h2>

            <p>Defina um nome e escolha uma cor para identificar sua categoria.</p>

            <label htmlFor="category-name">Nome da categoria</label>

            <input
              id="category-name"
              type="text"
              placeholder="Ex.: Matemática"
              value={name}
              onChange={event => setName(event.target.value)}
              maxLength={40}
              autoFocus
              required
            />

            <span className="category-color-label">Escolha uma cor</span>

            <div className="category-color-options">
              {categoryColors.map(option => (
                <button
                  type="button"
                  key={option}
                  className={color === option ? 'selected' : ''}
                  style={{ backgroundColor: option }}
                  onClick={() => setColor(option)}
                  aria-label={`Selecionar cor ${option}`}
                  aria-pressed={color === option}
                />
              ))}
            </div>

            <div className="category-dialog-actions">
              <button
                type="button"
                className="category-cancel"
                onClick={() => setShowForm(false)}
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="category-save"
              >
                {editingCategory ? 'Salvar alterações' : 'Criar categoria'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Confirmação de exclusão */}
      {categoryToDelete && (
        <div
          className="category-overlay"
          onClick={() => setCategoryToDelete(null)}
        >
          <section
            className="category-dialog category-delete-dialog"
            role="alertdialog"
            aria-modal="true"
            onClick={event => event.stopPropagation()}
          >
            <div className="category-warning-icon">
              <AlertTriangle size={27} />
            </div>

            <h2>Excluir categoria?</h2>

            <p>
              A categoria <strong>{categoryToDelete.name}</strong> será excluída.
              As anotações associadas serão mantidas, mas ficarão sem categoria.
            </p>

            <div className="category-dialog-actions">
              <button
                className="category-cancel"
                onClick={() => setCategoryToDelete(null)}
              >
                Cancelar
              </button>

              <button
                className="category-delete-button"
                onClick={confirmDelete}
              >
                <Trash2 size={17} />
                Excluir categoria
              </button>
            </div>
          </section>
        </div>
      )}

    </div>
  );
}

export default CategoryManager;
