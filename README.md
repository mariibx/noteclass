# NoteClass

O NoteClass é uma aplicação web para organizar anotações de estudos por categorias.

## Objetivo

Oferecer um espaço simples para criar, editar, pesquisar e organizar anotações, com opções de formatação e temas claro e escuro.

## Funcionalidades

- Criar, editar e excluir anotações.
- Pesquisar anotações por título e pelo texto do conteúdo.
- Organizar anotações em categorias com cores personalizadas.
- Marcar anotações como favoritas e arquivá-las ou desarquivá-las.
- Escrever com parágrafos, negrito, itálico e sublinhado.
- Alternar entre os temas claro e escuro.
- Usar a interface responsiva em computadores e dispositivos móveis.

As opções de Configurações e Notificações exibidas na interface ainda não têm funcionalidades implementadas.

## Tecnologias

Versões declaradas no `package.json`:

- React e React DOM `^19.3.1`.
- TipTap `^3.34.0` (integração React, StarterKit e extensões).
- Vite `^8.3.6`.
- Lucide React `^1.72.0` para ícones.
- ESLint `^10.14.0` para análise estática.

## Requisitos

- Node.js `^20.19.0` ou `>=22.12.0`.
- npm.
- Navegador moderno com suporte a `localStorage`.

## Executar localmente

Clone o repositório, instale as dependências e inicie o servidor de desenvolvimento:

```bash
git clone https://github.com/mariibx/noteclass.git
cd noteclass
npm install
npm run dev
```

O Vite informará o endereço local da aplicação no terminal.

## Comandos

```bash
npm run dev    # Inicia o servidor de desenvolvimento
npm run build  # Gera a versão de produção em dist/
npm run lint   # Executa o ESLint
```

## Armazenamento de dados

As anotações, categorias e a preferência de tema são armazenadas no `localStorage` do navegador, nas chaves `noteclass_notes`, `noteclass_categories` e `noteclass_theme`. Os dados ficam no navegador utilizado e não são sincronizados com uma conta ou banco de dados.

## Links

- Aplicação publicada: [noteclass-two.vercel.app](https://noteclass-two.vercel.app)
- Repositório: [github.com/mariibx/noteclass](https://github.com/mariibx/noteclass)
