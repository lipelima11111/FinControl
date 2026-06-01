// Mapa de URLs → controllers (camada que recebe a requisição HTTP)
const express     = require('express');
const router      = express.Router();

const authMiddleware       = require('../middlewares/authMiddleware');
const AuthController       = require('../controllers/authController');
const DashboardController  = require('../controllers/DashboardController');
const TransacaoController  = require('../controllers/TransacaoController');

// Rota raiz
router.get('/', (req, res) => res.redirect('/dashboard'));

// Rotas públicas: login e cadastro
router.get('/login',      AuthController.showLogin.bind(AuthController));
router.post('/login',     AuthController.login.bind(AuthController));
router.get('/cadastro',   AuthController.showCadastro.bind(AuthController));
router.post('/cadastro',  AuthController.cadastrar.bind(AuthController));


// Rotas protegidas: exigem authMiddleware antes do controller
router.get('/logout',     authMiddleware, AuthController.logout.bind(AuthController));

router.get('/dashboard',  authMiddleware, DashboardController.index.bind(DashboardController));

router.get('/transacoes/nova',         authMiddleware, TransacaoController.showNova.bind(TransacaoController));
router.post('/transacoes',             authMiddleware, TransacaoController.criar.bind(TransacaoController));
router.get('/transacoes/:id/editar',   authMiddleware, TransacaoController.showEditar.bind(TransacaoController));
router.post('/transacoes/:id',         authMiddleware, TransacaoController.atualizar.bind(TransacaoController));
router.post('/transacoes/:id/deletar', authMiddleware, TransacaoController.deletar.bind(TransacaoController));

module.exports = router;
