const bcrypt  = require('bcryptjs');
const { Usuario } = require('../models');

class AuthService {
  // Cadastro do usuário
  async cadastrar({ nome, email, senha, senha_confirmacao }) {
    if (!nome || !email || !senha || !senha_confirmacao)
      throw new Error('Preencha todos os campos.');
    if (senha !== senha_confirmacao)
      throw new Error('As senhas não coincidem.');
    if (senha.length < 8)
      throw new Error('A senha deve ter no mínimo 8 caracteres.');
    if (await Usuario.findOne({ where: { email } }))
      throw new Error('Este e-mail já está cadastrado.');

    const hash = await bcrypt.hash(senha, 10);
    return Usuario.create({ nome, email, senha: hash });
  }

  // Login do usuário
  async autenticarUsuario(email, senha) {
    if (!email || !senha)
      throw new Error('Preencha e-mail e senha.');

    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario || !(await bcrypt.compare(senha, usuario.senha)))
      throw new Error('E-mail ou senha incorretos.');

    return usuario;
  }
}

module.exports = new AuthService();
