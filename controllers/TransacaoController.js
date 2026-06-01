// Controller CRUD de transações: formulários e redirect após salvar
const TransacaoService = require('../services/TransacaoService');
const { Categoria }    = require('../models');
const viewHelper       = require('../utils/viewHelper');

class TransacaoController {
  async showNova(req, res) {
    const categorias = await Categoria.findAll({ order: [['tipo'], ['nome']] });
    res.render('transacoes/form', viewHelper.buildTransacaoForm(null, categorias, null));
  }

  async criar(req, res) {
    try {
      const { descricao, valor, data, categoria_id } = req.body;
      await TransacaoService.cadastrar({
        descricao, valor, data, categoria_id,
        usuario_id: req.session.usuarioId,
      });
      res.redirect('/dashboard');
    } catch (e) {
      const categorias = await Categoria.findAll({ order: [['tipo'], ['nome']] });
      res.render('transacoes/form', viewHelper.buildTransacaoForm(null, categorias, e.message));
    }
  }

  async showEditar(req, res) {
    const transacao = await TransacaoService.buscarPorId(req.params.id, req.session.usuarioId);
    if (!transacao) return res.redirect('/dashboard');
    const categorias = await Categoria.findAll({ order: [['tipo'], ['nome']] });
    res.render('transacoes/form', viewHelper.buildTransacaoForm(transacao, categorias, null));
  }

  async atualizar(req, res) {
    try {
      const { descricao, valor, data, categoria_id } = req.body;
      await TransacaoService.atualizar(req.params.id, req.session.usuarioId, {
        descricao, valor, data, categoria_id,
      });
      res.redirect('/dashboard');
    } catch (e) {
      const transacao  = await TransacaoService.buscarPorId(req.params.id, req.session.usuarioId);
      const categorias = await Categoria.findAll({ order: [['tipo'], ['nome']] });
      res.render('transacoes/form', viewHelper.buildTransacaoForm(transacao, categorias, e.message));
    }
  }

  async deletar(req, res) {
    try {
      await TransacaoService.deletar(req.params.id, req.session.usuarioId);
    } catch (e) { /* transação inexistente: segue para o dashboard */ }
    res.redirect('/dashboard');
  }
}

module.exports = new TransacaoController();
