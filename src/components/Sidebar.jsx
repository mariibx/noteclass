
import { useState, useEffect } from 'react';

import {
  GraduationCap,
  Plus,
  LayoutDashboard,
  Star,
  Archive,
  Tags,
  Sun,
  Moon,
  Settings,
  Menu,
  X
} from 'lucide-react';

import './Sidebar.css';

function Sidebar({
  activePage,
  onNavigate,
  theme,
  onToggleTheme
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const menuItems = [
    {
      id: 'home',
      label: 'Todas as notas',
      icon: LayoutDashboard
    },
    {
      id: 'favorites',
      label: 'Favoritas',
      icon: Star
    },
    {
      id: 'archived',
      label: 'Arquivadas',
      icon: Archive
    },
    {
      id: 'categories',
      label: 'Categorias',
      icon: Tags
    },
    {
      id: 'settings',
      label: 'Configurações',
      icon: Settings
    }
  ];

  // Fechar o menu com a tecla Escape
  useEffect(() => {
    function handleEscape(event) {
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
    }

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  // Bloquear a rolagem da página enquanto o menu estiver aberto
  useEffect(() => {
    if (!menuOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  // Fechar a gaveta ao retornar ao layout desktop
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 760) {
        setMenuOpen(false);
      }
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Navegar e fechar o menu
  function handleNavigate(page) {
    onNavigate(page);
    setMenuOpen(false);
  }

  // Alternar menu
  function toggleMenu() {
    setMenuOpen(open => !open);
  }

  return (
    <aside className={`sidebar ${menuOpen ? 'menu-open' : ''}`}>

      {/* Cabeçalho sempre visível */}
      <div className="sidebar-top">

        <div className="sidebar-brand">

          <div className="brand-icon">
            <GraduationCap size={22} />
          </div>

          <span>NoteClass</span>

        </div>

        {/* Botão de abrir e fechar menu no celular */}
        <button
          type="button"
          className="mobile-menu-button"
          onClick={toggleMenu}
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuOpen}
          aria-controls="sidebar-navigation"
        >
          {menuOpen ? (
            <X size={22} />
          ) : (
            <Menu size={22} />
          )}
        </button>

      </div>

      {/* Fundo escurecido */}
      <button
        type="button"
        className="sidebar-overlay"
        onClick={() => setMenuOpen(false)}
        aria-label="Fechar menu"
        aria-hidden={!menuOpen}
        tabIndex={menuOpen ? 0 : -1}
      />

      {/* Conteúdo da gaveta lateral */}
      <div
        className="sidebar-content"
        id="sidebar-navigation"
      >

        {/* Cabeçalho interno do menu mobile */}
        <div className="drawer-header">

          <span>Menu de navegação</span>

          <button
            type="button"
            className="drawer-close-button"
            onClick={() => setMenuOpen(false)}
            aria-label="Fechar menu"
          >
            <X size={19} />
          </button>

        </div>

        {/* Nova anotação */}
        <button
          type="button"
          className="new-note-button"
          onClick={() => handleNavigate('new')}
        >
          <Plus size={17} />
          <span>Nova anotação</span>
        </button>

        {/* Identificação do menu */}
        <p className="menu-label">
          MENU PRINCIPAL
        </p>

        {/* Itens de navegação */}
        <nav
          className="sidebar-nav"
          aria-label="Navegação principal"
        >

          {menuItems.map(item => {
            const Icon = item.icon;

            return (
              <button
                type="button"
                key={item.id}
                className={`nav-item ${
                  activePage === item.id ? 'active' : ''
                }`}
                onClick={() => handleNavigate(item.id)}
                aria-current={
                  activePage === item.id ? 'page' : undefined
                }
              >
                <Icon size={17} />

                <span>{item.label}</span>

              </button>
            );
          })}

        </nav>

        {/* Alternar tema */}
        <button
          type="button"
          className="theme-toggle"
          onClick={onToggleTheme}
        >

          {theme === 'light' ? (
            <Sun size={17} />
          ) : (
            <Moon size={17} />
          )}

          <span>
            {theme === 'light'
              ? 'Tema claro'
              : 'Tema escuro'}
          </span>

        </button>

      </div>

    </aside>
  );
}

export default Sidebar;
