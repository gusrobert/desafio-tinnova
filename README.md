# Desafio Tinnova

Sistema de gerenciamento de veículos com soluções para exercícios de programação, construído com Next.js e Spring Boot.

## 📋 Funcionalidades

- **Solução dos exercícios propostos**: Implementação dos exercícios de porcentagens eleitorais, Bubble Sort, fatorial e soma de múltiplos
- **Gestão de veículos**: Cadastro e gerenciamento de veículos com marcas e modelos pré-definidos
- **Dashboard**: Painel de controle com informações resumidas

## 🚀 Tecnologias

### Frontend
- [Next.js 15](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Shadcn/ui](https://ui.shadcn.com/)

### Backend
- [Spring Boot 3.5](https://spring.io/projects/spring-boot)
- [Java 17](https://openjdk.org/)
- [PostgreSQL 15](https://www.postgresql.org/)
- [Docker](https://www.docker.com/)

## 💻 Pré-requisitos

### Para desenvolvimento local:
- Node.js 18 ou superior
- Java 17 ou superior
- PostgreSQL 15 ou superior
- Maven (ou use o wrapper incluído)

### Para Docker:
- Docker e Docker Compose

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone [URL_DO_REPOSITORIO]
cd desafio-tinnova/desafio-tinnova-front
```

2. Instale as dependências:
```bash
npm install
```

3. (Opcional) Configure a URL da API:
Crie um arquivo `.env.local` na raiz do frontend com o conteúdo:
```
NEXT_PUBLIC_API_URL=http://localhost:8080
```
O backend deve estar rodando em `http://localhost:8080` para o frontend funcionar corretamente.

## 🚀 Executando o projeto

### Desenvolvimento local:

#### Backend (Spring Boot):
1. Navegue até o diretório do backend:
```bash
cd desafio-tinnova-back
```

2. Configure o banco PostgreSQL e ajuste as configurações em `application.properties`

3. Execute o backend:
```bash
./mvnw spring-boot:run
```
O backend estará disponível em `http://localhost:8080`

#### Frontend (Next.js):
1. Navegue até o diretório do frontend:
```bash
cd desafio-tinnova-front
```

2. Execute o frontend:
```bash
npm run dev
```
O frontend estará disponível em `http://localhost:3000`

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
- Iniciar o backend em `http://localhost:8080`
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
desafio-tinnova/
├── desafio-tinnova-front/     # Frontend Next.js
│   ├── src/
│   │   ├── app/               # Páginas e rotas da aplicação
│   │   ├── components/        # Componentes reutilizáveis
│   │   │   ├── dashboard/     # Componentes específicos do dashboard
│   │   │   ├── layout/        # Componentes de layout (Header, Sidebar)
│   │   │   ├── shared/        # Componentes compartilhados
│   │   │   └── ui/            # Componentes base da UI
│   │   ├── hooks/             # Hooks personalizados
│   │   └── lib/               # Utilitários e tipos
│   └── package.json
└── desafio-tinnova-back/      # Backend Spring Boot
    ├── src/main/java/         # Código fonte Java
    │   └── br/com/tinnova/
    │       ├── controller/    # Controllers REST
    │       ├── entity/        # Entidades JPA
    │       ├── service/       # Serviços de negócio
    │       └── repository/    # Repositórios de dados
    └── pom.xml
```
