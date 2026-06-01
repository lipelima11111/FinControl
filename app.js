// Ponto de entrada: configura Express, sessão, views e sobe o servidor
const express         = require('express');
const session         = require('express-session');
const path            = require('path');
const mustacheExpress = require('mustache-express');

const sequelize  = require('./config/database');
const { Categoria } = require('./models'); // carrega modelos e associações
const { CATEGORIAS_SEED } = require('./constants/categorias');
const routes     = require('./routes');

const app  = express();
const PORT = process.env.PORT || 8080;

// Templates HTML com Mustache (extensão .mustache)
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, 'views'));

// Lê formulários, JSON e arquivos estáticos (CSS)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Sessão guarda usuarioId após login (cookie de 7 dias)
app.use(session({
  secret: process.env.SESSION_SECRET || 'fincontrol-secret-2026',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 },
}));

app.use('/', routes);

// Cria tabelas no SQLite e insere categorias na primeira execução
sequelize.sync().then(async () => {
  const total = await Categoria.count();
  if (total === 0) {
    await Categoria.bulkCreate(CATEGORIAS_SEED);
    console.log('Categorias padrão criadas.');
  }
  app.listen(PORT, () => console.log(`FinControl rodando em http://localhost:${PORT}`));
});
