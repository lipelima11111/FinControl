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

// View engine
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, 'views'));

// Middlewares globais
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET || 'fincontrol-secret-2026',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 },
}));

// Rotas
app.use('/', routes);

// Sincroniza banco e inicia servidor
sequelize.sync().then(async () => {
  const total = await Categoria.count();
  if (total === 0) {
    await Categoria.bulkCreate(CATEGORIAS_SEED);
    console.log('Categorias padrão criadas.');
  }
  app.listen(PORT, () => console.log(`FinControl rodando em http://localhost:${PORT}`));
});
