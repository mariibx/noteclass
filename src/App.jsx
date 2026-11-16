
import { useState, useEffect, useRef } from 'react';

import {
  Search,
  Bell,
  ChevronDown,
  Check,
  BookOpen
} from 'lucide-react';

import Sidebar from './components/Sidebar';
import NoteGrid from './components/NoteGrid';
import NoteEditor from './pages/NoteEditor';
import CategoryManager from './pages/CategoryManager';
import ConfirmDialog from './components/ConfirmDialog';

import './App.css';

function App() {
  // Navegação
  const [activePage, setActivePage] = useState('home');

  // Anotações
  const [editingNote, setEditingNote] = useState(null);
  const [noteToDelete, setNoteToDelete] = useState(null);

  // Pesquisa e filtros
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Menu personalizado de categorias
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const categoryDropdownRef = useRef(null);

  // Fechar o seletor ao clicar fora ou pressionar Escape
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target)
      ) {
        setCategoryDropdownOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === 'Escape') {
        setCategoryDropdownOpen(false);
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

  // Tema
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('noteclass_theme') || 'light';
  });

  // Recuperar anotações
  const [notes, setNotes] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem('noteclass_notes')
      ) || [];
    } catch {
      return [];
    }
  });

  // Recuperar categorias
  const [categories, setCategories] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem('noteclass_categories')
      ) || [];
    } catch {
      return [];
    }
  });

  // Salvar anotações
  useEffect(() => {
    localStorage.setItem(
      'noteclass_notes',
      JSON.stringify(notes)
    );
  }, [notes]);

  // Salvar categorias
  useEffect(() => {
    localStorage.setItem(
      'noteclass_categories',
      JSON.stringify(categories)
    );
  }, [categories]);

  // Alternar tema
  function toggleTheme() {
    const newTheme =
      theme === 'light' ? 'dark' : 'light';

    setTheme(newTheme);

    localStorage.setItem(
      'noteclass_theme',
      newTheme
    );
  }

  // Título da página
  function getPageTitle() {
    const titles = {
      home: 'Minhas anotações',
      favorites: 'Favoritas',
      archived: 'Arquivadas',
      categories: 'Minhas categorias',
      settings: 'Configurações',
      new: editingNote
        ? 'Editar anotação'
        : 'Nova anotação'
    };

    return titles[activePage] || 'NoteClass';
  }

  // Abrir nova anotação
  function openNewNote() {
    setEditingNote(null);
    setActivePage('new');
  }

  // Editar anotação
  function openEditNote(note) {
    setEditingNote(note);
    setActivePage('new');
  }

  // Salvar anotação
  function saveNote(data) {
    const now = new Date().toISOString();

    if (editingNote) {
      setNotes(currentNotes =>
        currentNotes.map(note =>
          note.id === editingNote.id
            ? {
                ...note,
                ...data,
                updatedAt: now
              }
            : note
        )
      );
    } else {
      const newNote = {
        id: crypto.randomUUID(),
        categoryId: null,
        categoryName: null,
        categoryColor: null,
        favorite: false,
        archived: false,
        createdAt: now,
        updatedAt: now,
        ...data
      };

      setNotes(currentNotes => [
        newNote,
        ...currentNotes
      ]);
    }

    setEditingNote(null);
    setActivePage('home');
    setSearch('');
    setCategoryFilter('all');
    setCategoryDropdownOpen(false);
  }

  // Solicitar exclusão
  function deleteNote(id) {
    const selectedNote = notes.find(
      note => note.id === id
    );

    if (selectedNote) {
      setNoteToDelete(selectedNote);
    }
  }

  // Confirmar exclusão
  function confirmDelete() {
    if (!noteToDelete) return;

    setNotes(currentNotes =>
      currentNotes.filter(
        note => note.id !== noteToDelete.id
      )
    );

    setNoteToDelete(null);
  }

  // Alternar favorito
  function toggleFavorite(id) {
    setNotes(currentNotes =>
      currentNotes.map(note =>
        note.id === id
          ? {
              ...note,
              favorite: !note.favorite
            }
          : note
      )
    );
  }

  // Arquivar ou desarquivar
  function archiveNote(id) {
    setNotes(currentNotes =>
      currentNotes.map(note =>
        note.id === id
          ? {
              ...note,
              archived: !note.archived
            }
          : note
      )
    );
  }

  // Criar ou editar categoria
  function saveCategory(category) {
    setCategories(currentCategories => {
      const exists = currentCategories.some(
        item => item.id === category.id
      );

      if (exists) {
        return currentCategories.map(item =>
          item.id === category.id
            ? category
            : item
        );
      }

      return [
        ...currentCategories,
        category
      ];
    });

    // Atualizar nome e cor nas anotações associadas
    setNotes(currentNotes =>
      currentNotes.map(note =>
        note.categoryId === category.id
          ? {
              ...note,
              categoryName: category.name,
              categoryColor: category.color
            }
          : note
      )
    );
  }

  // Excluir categoria e desvincular anotações
  function deleteCategory(id) {
    setCategories(currentCategories =>
      currentCategories.filter(
        category => category.id !== id
      )
    );

    setNotes(currentNotes =>
      currentNotes.map(note =>
        note.categoryId === id
          ? {
              ...note,
              categoryId: null,
              categoryName: null,
              categoryColor: null
            }
          : note
      )
    );

    if (categoryFilter === id) {
      setCategoryFilter('all');
    }
  }

  // Selecionar categoria
  function selectCategory(id) {
    setCategoryFilter(id);
    setCategoryDropdownOpen(false);
  }

  // Nome da categoria selecionada
  const selectedCategory = categories.find(
    category => category.id === categoryFilter
  );

  const selectedCategoryName =
    categoryFilter === 'all'
      ? 'Todas as categorias'
      : selectedCategory?.name || 'Todas as categorias';

  // Filtrar anotações
  const visibleNotes = notes.filter(note => {
    const title = (note.title || '').toLowerCase();
    const content = (note.content || '').toLowerCase();
    const searchTerm = search.toLowerCase();

    // Pesquisa
    const matchesSearch =
      title.includes(searchTerm) ||
      content.includes(searchTerm);

    // Categoria
    const matchesCategory =
      categoryFilter === 'all' ||
      note.categoryId === categoryFilter;

    // Favoritas
    if (activePage === 'favorites') {
      return (
        note.favorite &&
        !note.archived &&
        matchesSearch &&
        matchesCategory
      );
    }

    // Arquivadas
    if (activePage === 'archived') {
      return (
        note.archived &&
        matchesSearch &&
        matchesCategory
      );
    }

    // Todas as anotações
    return (
      !note.archived &&
      matchesSearch &&
      matchesCategory
    );
  });

  return (
    <div
      className="app-container"
      data-theme={theme}
    >

      {/* Menu lateral */}
      <Sidebar
        activePage={activePage}
        onNavigate={page => {
          setEditingNote(null);
          setSearch('');
          setCategoryFilter('all');
          setCategoryDropdownOpen(false);
          setActivePage(page);
        }}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Conteúdo principal */}
      <main className="main-content">

        {activePage === 'new' ? (

          /* Editor */
          <NoteEditor
            note={editingNote}
            categories={categories}
            onSave={saveNote}
            onCancel={() => {
              setEditingNote(null);
              setActivePage('home');
            }}
          />

        ) : (

          <>

            {/* Cabeçalho */}
            <header className="main-header">

              <div>
                <h1>{getPageTitle()}</h1>

                <p>
                  Organize seus estudos em um só lugar.
                </p>
              </div>

              <div className="header-actions">

                {/* Pesquisa */}
                <div className="search-box">
                  <Search size={18} />

                  <input
                    type="text"
                    placeholder="Pesquisar anotações..."
                    value={search}
                    onChange={event =>
                      setSearch(event.target.value)
                    }
                  />
                </div>

                {/* Filtro personalizado por categoria */}
                {['home', 'favorites', 'archived'].includes(activePage) && (

                  <div
                    className={`category-filter ${
                      categoryDropdownOpen ? 'dropdown-open' : ''
                    }`}
                    ref={categoryDropdownRef}
                  >

                    <button
                      type="button"
                      className="category-select-button"
                      onClick={() =>
                        setCategoryDropdownOpen(open => !open)
                      }
                      aria-expanded={categoryDropdownOpen}
                      aria-haspopup="listbox"
                    >
                      <span>{selectedCategoryName}</span>

                      <ChevronDown
                        size={17}
                        className="category-chevron"
                      />
                    </button>

                    {categoryDropdownOpen && (

                      <div
                        className="category-dropdown-menu"
                        role="listbox"
                        aria-label="Categorias"
                      >

                        <button
                          type="button"
                          className={`category-option ${
                            categoryFilter === 'all' ? 'selected' : ''
                          }`}
                          onClick={() => selectCategory('all')}
                          role="option"
                          aria-selected={categoryFilter === 'all'}
                        >
                          <span>Todas as categorias</span>

                          {categoryFilter === 'all' && (
                            <Check size={16} />
                          )}
                        </button>

                        {categories.map(category => (

                          <button
                            type="button"
                            key={category.id}
                            className={`category-option ${
                              categoryFilter === category.id
                                ? 'selected'
                                : ''
                            }`}
                            onClick={() => selectCategory(category.id)}
                            role="option"
                            aria-selected={
                              categoryFilter === category.id
                            }
                          >
                            <span>{category.name}</span>

                            {categoryFilter === category.id && (
                              <Check size={16} />
                            )}
                          </button>

                        ))}

                        {categories.length === 0 && (
                          <p className="category-empty">
                            Nenhuma categoria cadastrada.
                          </p>
                        )}

                      </div>

                    )}

                  </div>

                )}

                {/* Notificações */}
                <button
                  className="icon-button"
                  aria-label="Notificações"
                  type="button"
                >
                  <Bell size={20} />
                </button>

              </div>

            </header>

            {/* Conteúdo das páginas */}
            <section className="notes-content">

              {activePage === 'categories' ? (

                <CategoryManager
                  categories={categories}
                  notes={notes}
                  onSave={saveCategory}
                  onDelete={deleteCategory}
                />

              ) : activePage === 'home' &&
                notes.length === 0 ? (

                /* Tela inicial vazia */
                <div className="welcome-card">

                  <div className="welcome-icon">
                    <BookOpen size={30} />
                  </div>

                  <h2>Bem-vindo ao NoteClass!</h2>

                  <p>
                    Seu espaço para organizar anotações,
                    disciplinas e estudos.
                  </p>

                  <button
                    className="welcome-button"
                    onClick={openNewNote}
                  >
                    Criar minha primeira anotação
                  </button>

                </div>

              ) : (

                <>

                  {(
                    activePage === 'home' ||
                    activePage === 'favorites' ||
                    activePage === 'archived'
                  ) ? (

                    <>

                      {/* Barra de anotações */}
                      {activePage === 'home' && (

                        <div className="notes-toolbar">

                          <h2>Suas anotações</h2>

                          <button
                            className="welcome-button"
                            onClick={openNewNote}
                          >
                            + Nova anotação
                          </button>

                        </div>

                      )}

                      {/* Grade */}
                      <NoteGrid
                        notes={visibleNotes}
                        onEdit={openEditNote}
                        onDelete={deleteNote}
                        onToggleFavorite={toggleFavorite}
                        onArchive={archiveNote}
                      />

                    </>

                  ) : (

                    <div className="welcome-card">

                      <h2>{getPageTitle()}</h2>

                      <p>
                        Esta área será desenvolvida nas próximas etapas.
                      </p>

                    </div>

                  )}

                </>

              )}

            </section>

          </>

        )}

      </main>

      {/* Confirmação de exclusão */}
      <ConfirmDialog
        note={noteToDelete}
        onCancel={() => setNoteToDelete(null)}
        onConfirm={confirmDelete}
      />

    </div>
  );
}

export default App;
