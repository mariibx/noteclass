
import {
  useEffect,
  useRef,
  useState
} from 'react';

import { Extension } from '@tiptap/core';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TaskItem, TaskList } from '@tiptap/extension-list';

import {
  ArrowLeft,
  Save,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  ChevronDown,
  Check
} from 'lucide-react';

import './NoteEditor.css';

const legacyBlockShortcutGuard = Extension.create({
  name: 'legacyBlockShortcutGuard',
  priority: 1000,

  addKeyboardShortcuts() {
    return {
      'Mod-Alt-1': () => true,
      'Mod-Alt-2': () => true,
      'Mod-Alt-3': () => true,
      'Mod-Shift-7': () => true,
      'Mod-Shift-8': () => true,
      'Mod-Shift-9': () => true,
      'Mod-Shift-b': () => true,
      'Mod-Alt-c': () => true,
      'Mod-e': () => true,
      'Mod-Shift-s': () => true
    };
  }
});

function NoteEditor({ note, categories, onSave, onCancel }) {
  const [title, setTitle] = useState(note?.title || '');

  const [categoryId, setCategoryId] = useState(
    note?.categoryId || ''
  );

  const [categoryOpen, setCategoryOpen] = useState(false);
  const [isContentEmpty, setIsContentEmpty] = useState(true);
  const [saveStatus, setSaveStatus] = useState('idle');
  const [toolbarVersion, setToolbarVersion] = useState(0);

  const categoryRef = useRef(null);
  const saveTimerRef = useRef(null);

  const editor = useEditor({
    extensions: [StarterKit, TaskList, TaskItem, legacyBlockShortcutGuard],
    content: note?.content || '',
    enableInputRules: false,
    onCreate: ({ editor: currentEditor }) => {
      setIsContentEmpty(currentEditor.isEmpty);
    },
    onUpdate: ({ editor: currentEditor }) => {
      setIsContentEmpty(currentEditor.isEmpty);
    },

    editorProps: {
      attributes: {
        class: 'rich-editor-content',
        'aria-label': 'Conteúdo da anotação'
      }
    }
  });

  // Atualizar os botões quando a seleção ou formatação mudar
  useEffect(() => {
    if (!editor) return;

    function updateToolbar() {
      setToolbarVersion(version => version + 1);
    }

    editor.on('selectionUpdate', updateToolbar);
    editor.on('transaction', updateToolbar);

    return () => {
      editor.off('selectionUpdate', updateToolbar);
      editor.off('transaction', updateToolbar);
    };
  }, [editor]);

  // Limpar temporizador ao sair do editor
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, []);

  // Fechar categoria ao clicar fora ou pressionar Escape
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        categoryRef.current &&
        !categoryRef.current.contains(event.target)
      ) {
        setCategoryOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === 'Escape') {
        setCategoryOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  // Categoria selecionada
  const selectedCategory = categories.find(
    category => category.id === categoryId
  );

  // Salvar anotação
  function handleSave() {
    if (saveStatus === 'saving' || saveStatus === 'saved') {
      return;
    }

    if (!title.trim()) {
      alert('Digite um título para sua anotação.');
      return;
    }

    const noteData = {
      title: title.trim(),
      content: editor?.getHTML() || '',
      categoryId: selectedCategory?.id || null,
      categoryName: selectedCategory?.name || null,
      categoryColor: selectedCategory?.color || null
    };

    setSaveStatus('saving');

    saveTimerRef.current = setTimeout(() => {
      setSaveStatus('saved');

      saveTimerRef.current = setTimeout(() => {
        onSave(noteData);
      }, 450);

    }, 350);
  }

  function selectCategory(id) {
    setCategoryId(id);
    setCategoryOpen(false);
  }

  if (!editor) {
    return <p>Carregando editor...</p>;
  }

  return (
    <div className="note-editor-page">

      {/* Cabeçalho */}
      <header className="editor-header">

        <button
          type="button"
          className="editor-back"
          onClick={onCancel}
          disabled={saveStatus === 'saving' || saveStatus === 'saved'}
        >
          <ArrowLeft size={19} />
          <span>Voltar</span>
        </button>

        <button
          type="button"
          className={`editor-save ${
            saveStatus === 'saved' ? 'save-success' : ''
          }`}
          onClick={handleSave}
          disabled={saveStatus === 'saving' || saveStatus === 'saved'}
        >
          {saveStatus === 'saved' ? (
            <>
              <Check size={18} />
              <span>Salvo!</span>
            </>
          ) : saveStatus === 'saving' ? (
            <>
              <Save size={18} />
              <span>Salvando...</span>
            </>
          ) : (
            <>
              <Save size={18} />
              <span>Salvar anotação</span>
            </>
          )}
        </button>

      </header>

      {/* Área de edição */}
      <div className="editor-container">

        {/* Título */}
        <input
          className="editor-title"
          type="text"
          placeholder="Título da anotação..."
          value={title}
          onChange={event => setTitle(event.target.value)}
          maxLength={120}
          aria-label="Título da anotação"
        />

        {/* Categoria */}
        <div className="editor-category">

          <label>Categoria</label>

          <div
            className={`editor-category-select ${
              categoryOpen ? 'category-open' : ''
            }`}
            ref={categoryRef}
          >

            <button
              type="button"
              className="editor-category-button"
              onClick={() => setCategoryOpen(open => !open)}
              aria-expanded={categoryOpen}
              aria-haspopup="listbox"
            >
              <span>
                {selectedCategory?.name || 'Sem categoria'}
              </span>

              <ChevronDown
                size={17}
                className="editor-category-chevron"
              />
            </button>

            {categoryOpen && (

              <div
                className="editor-category-options"
                role="listbox"
                aria-label="Selecionar categoria"
              >

                <button
                  type="button"
                  className={`editor-category-option ${
                    categoryId === '' ? 'selected' : ''
                  }`}
                  onClick={() => selectCategory('')}
                  role="option"
                  aria-selected={categoryId === ''}
                >
                  <span>Sem categoria</span>

                  {categoryId === '' && (
                    <Check size={16} />
                  )}
                </button>

                {categories.map(category => (

                  <button
                    type="button"
                    key={category.id}
                    className={`editor-category-option ${
                      categoryId === category.id ? 'selected' : ''
                    }`}
                    onClick={() => selectCategory(category.id)}
                    role="option"
                    aria-selected={categoryId === category.id}
                  >
                    <span className="editor-option-name">
                      <span
                        className="editor-option-dot"
                        style={{
                          backgroundColor: category.color || '#8872C7'
                        }}
                      />

                      {category.name}
                    </span>

                    {categoryId === category.id && (
                      <Check size={16} />
                    )}
                  </button>

                ))}

                {categories.length === 0 && (
                  <p className="editor-category-empty">
                    Nenhuma categoria cadastrada.
                  </p>
                )}

              </div>

            )}

          </div>

          {selectedCategory && (
            <div className="selected-category">
              <span
                className="selected-category-dot"
                style={{
                  backgroundColor:
                    selectedCategory.color || '#8872C7'
                }}
              />

              {selectedCategory.name}
            </div>
          )}

        </div>

        {/* Barra de formatação */}
        <div
          className="editor-toolbar"
          data-toolbar-version={toolbarVersion}
        >

          <button
            type="button"
            className={editor.isActive('bold') ? 'selected' : ''}
            onMouseDown={event => event.preventDefault()}
            onClick={() =>
              editor.chain().focus().toggleBold().run()
            }
            aria-label="Negrito"
            aria-pressed={editor.isActive('bold')}
            title="Negrito"
          >
            <Bold size={19} />
          </button>

          <button
            type="button"
            className={editor.isActive('italic') ? 'selected' : ''}
            onMouseDown={event => event.preventDefault()}
            onClick={() =>
              editor.chain().focus().toggleItalic().run()
            }
            aria-label="Itálico"
            aria-pressed={editor.isActive('italic')}
            title="Itálico"
          >
            <Italic size={19} />
          </button>

          <button
            type="button"
            className={editor.isActive('underline') ? 'selected' : ''}
            onMouseDown={event => event.preventDefault()}
            onClick={() =>
              editor.chain().focus().toggleUnderline().run()
            }
            aria-label="Sublinhado"
            aria-pressed={editor.isActive('underline')}
            title="Sublinhado"
          >
            <UnderlineIcon size={19} />
          </button>

        </div>

        {/* Área de escrita */}
        <div className="editor-writing-area">

          {isContentEmpty && (
            <div className="editor-placeholder">
              Comece a escrever sua anotação...
            </div>
          )}

          <EditorContent editor={editor} />

        </div>

      </div>

    </div>
  );
}

export default NoteEditor;