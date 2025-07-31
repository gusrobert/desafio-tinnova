# Desafio Tinnova

Um sistema de gerenciamento escolar construído com Next.js.

## 📋 Funcionalidades

- **Dashboard**: Visualização de histórico de aulas e aulas do dia
- **Professores**: Gerenciamento completo de professores
- **Alunos**: Cadastro e gerenciamento de alunos
- **Agendamentos**: Sistema de agendamento de aulas

## 🚀 Tecnologias

- [Next.js 14](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Docker](https://www.docker.com/)

## 💻 Pré-requisitos

- Node.js 18 ou superior
- Docker e Docker Compose (opcional)

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone [URL_DO_REPOSITORIO]
cd frontend
```

2. Instale as dependências:
```bash
npm install
```

## 🚀 Executando o projeto

### Desenvolvimento local:
```bash
npm run dev
```
O projeto estará disponível em `http://localhost:3000`

### Usando Docker:
```bash
docker-compose up
```

## 🐳 Executando com Docker

O projeto está configurado para rodar completamente com Docker, incluindo frontend, backend e banco de dados.

1. Certifique-se de ter o Docker e Docker Compose instalados
2. Na raiz do projeto, execute:

```bash
docker compose up --build
```

Isso irá:
- Iniciar o frontend em `http://localhost:3000`
- Iniciar o backend em `http://localhost:5000`
- Iniciar o banco PostgreSQL na porta `5432`

Para parar todos os serviços:
```bash
docker compose down
```

Para limpar volumes e reconstruir tudo do zero:
```bash
docker compose down -v && docker compose up --build
```

## 📁 Estrutura do Projeto

```
src/
├── app/               # Páginas e rotas da aplicação
├── components/        # Componentes reutilizáveis
│   ├── dashboard/     # Componentes específicos do dashboard
│   ├── layout/       # Componentes de layout (Header, Sidebar)
│   ├── shared/       # Componentes compartilhados
│   └── ui/           # Componentes base da UI
├── hooks/            # Hooks personalizados
└── lib/              # Utilitários e tipos

```
