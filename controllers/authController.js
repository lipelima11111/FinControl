const AuthService = require('../services/authService');

class AuthController {
  showLogin(req, res) {
    res.render('auth/login', { erro: null });
  }

  showCadastro(req, res) {
    res.render('auth/cadastro', { erro: null });
  }

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

  async cadastrar(req, res) {
    try {
      await AuthService.cadastrar(req.body);
      res.redirect('/login');
    } catch (e) {
      res.render('auth/cadastro', { erro: e.message });
    }
  }

  logout(req, res) {
    req.session.destroy(() => res.redirect('/login'));
  }
}

module.exports = new AuthController();
