// Controller de autenticação: liga HTTP (req/res) ao AuthService
const AuthService = require('../services/authService');

class AuthController {
  // Exibe formulário de login
  showLogin(req, res) {
    res.render('auth/login', { erro: null });
  }

  // Exibe formulário de cadastro
  showCadastro(req, res) {
    res.render('auth/cadastro', { erro: null });
  }

  // Valida credenciais e grava id na sessão
  async login(req, res) {
    try {
      const { email, senha } = req.body;
      const usuario = await AuthService.autenticarUsuario(email, senha);
      req.session.usuarioId   = usuario.id;
      req.session.usuarioNome = usuario.nome;
      res.redirect('/dashboard');
    } catch (e) {
      res.render('auth/login', { erro: e.message });
    }
  }

  // Cria novo usuário
  async cadastrar(req, res) {
    try {
      await AuthService.cadastrar(req.body);
      res.redirect('/login');
    } catch (e) {
      res.render('auth/cadastro', { erro: e.message });
    }
  }

  // Encerra sessão do usuário logado
  logout(req, res) {
    req.session.destroy(() => res.redirect('/login'));
  }
}

module.exports = new AuthController();
