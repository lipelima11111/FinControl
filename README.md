# FinControl

Aplicação web de **controle financeiro pessoal** desenvolvida para o projeto acadêmico **UCB — Grupo 3**. Permite cadastrar usuários, registrar receitas e despesas por categoria, acompanhar saldo em tempo real e consultar o histórico de transações.

## Funcionalidades

- Cadastro e login com senha criptografada (bcrypt)
- Dashboard com saldo total, entradas, saídas e histórico de transações
- CRUD de transações (criar, editar e excluir)
- Categorias pré-definidas (receita/despesa), com seed automático no primeiro uso
- Sessão por usuário (`express-session`) e rotas protegidas por middleware
- Interface responsiva com Bootstrap 5.

## Stack e versões


| Camada  | Tecnologia                  | Versão          |
| ------- | --------------------------- | --------------- |
| Runtime | Node.js                     | 18+ recomendado |
| HTTP    | Express                     | 4.22.1          |
| Views   | Mustache + mustache-express | 1.3.2           |
| ORM     | Sequelize                   | 6.37.8          |
| Banco   | SQLite (driver `sqlite3`)   | 6.0.1           |
| Sessão  | express-session             | 1.19.0          |
| Senha   | bcryptjs                    | 2.4.3           |
| UI      | Bootstrap                   | 5.3.0           |
| Ícones  | Boxicons                    | 2.1.4           |



## Pré-requisitos

- [Node.js](https://nodejs.org/) 18 ou superior
- npm (incluso com o Node)

## Instalação e execução

```bash
# Clonar o repositório e entrar na pasta
cd fincontrol

# Instalar dependências
npm install

# Subir em modo desenvolvimento (reload automático)
npm run dev
```

Acesse no navegador: **[http://localhost:8080](http://localhost:8080)**

Na primeira execução, o Sequelize cria o banco em `data/fincontrol.db` e insere as categorias padrão se a tabela estiver vazia.

### Usuário demo (seed)

Para popular o banco com um usuário de teste e transações de exemplo:
```bash
npm run seed:demo
```
Credenciais: **demo@fincontrol.com** / senha: **password**

Apagar as transações do seed:
```bash
node scripts/seed-demo.js --force
```


## Rotas da API web


| Método | Rota                      | Autenticação | Descrição                       |
| ------ | ------------------------- | ------------ | ------------------------------- |
| GET    | `/`                       | —            | Redireciona para `/dashboard`   |
| GET    | `/login`                  | —            | Tela de login                   |
| POST   | `/login`                  | —            | Autentica usuário e cria sessão |
| GET    | `/cadastro`               | —            | Tela de cadastro                |
| POST   | `/cadastro`               | —            | Cria novo usuário               |
| GET    | `/logout`                 | sim          | Encerra sessão                  |
| GET    | `/dashboard`              | sim          | Painel com resumo e histórico   |
| GET    | `/transacoes/nova`        | sim          | Formulário de nova transação    |
| POST   | `/transacoes`             | sim          | Salva nova transação            |
| GET    | `/transacoes/:id/editar`  | sim          | Formulário de edição            |
| POST   | `/transacoes/:id`         | sim          | Atualiza transação              |
| POST   | `/transacoes/:id/deletar` | sim          | Remove transação                |


Rotas marcadas com **sim** exigem sessão ativa (`authMiddleware`).

## Modelo de dados


| Entidade      | Campos principais                                          |
| ------------- | ---------------------------------------------------------- |
| **Usuario**   | `nome`, `email`, `senha` (hash bcrypt)                     |
| **Categoria** | `nome`, `tipo` (`receita` & `despesa`)                     |
| **Transacao** | `descricao`, `valor`, `data`, `usuario_id`, `categoria_id` |


## Estrutura do projeto

```text
fincontrol/
├── config/          # Conexão SQLite (Sequelize)
├── controllers/     # Camada HTTP (render e redirect)
├── data/            # Banco SQLite (gerado em runtime)
├── docs/            # Documentação de arquitetura
├── middlewares/     # Autenticação de rotas
├── models/          # Entidades e associações
├── public/          # CSS global e por página
├── routes/          # Mapa de rotas Express
├── services/        # Regras de negócio
├── utils/           # viewHelper (view models Mustache)
├── views/           # Templates .mustache
└── app.js           # Entrada da aplicação
```

Detalhes de camadas, fluxo e view engine: **[docs/architecture.md](docs/architecture.md)**

## Arquitetura (resumo)

A aplicação segue separação em camadas:

1. **Routes** → definem endpoints e aplicam middleware
2. **Controllers** → orquestram request/response e sessão
3. **Services** → validações e lógica de negócio
4. **Models** → persistência via Sequelize
5. **viewHelper + views** → Mustache é logic-less; dados formatados no servidor antes do `res.render()`

Assets em `public/`: `styles.css` (global) e `css/auth.css`, `css/dashboard.css`, `css/transacoes.css` (por tela).


## Licença e autoria

Projeto acadêmico — **UCB Grupo 3**, 2026.