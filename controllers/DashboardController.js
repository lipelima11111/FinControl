// Controller do painel: busca saldo/histórico e monta dados para a view
const DashboardService = require('../services/DashboardService');
const viewHelper = require('../utils/viewHelper');

class DashboardController {
  async index(req, res) {
    try {
      const usuarioId = req.session.usuarioId;
      const { saldo, receitas, despesas } = await DashboardService.calcularSaldoTotal(usuarioId);
      const historico = await DashboardService.buscarHistorico(usuarioId);
      const historicoView = viewHelper.mapHistorico(historico);

      res.render('dashboard/index', {
        usuarioNome: req.session.usuarioNome,
        saldoFormatado: viewHelper.formatMoeda(saldo),
        receitasFormatado: viewHelper.formatMoeda(receitas),
        despesasFormatado: viewHelper.formatMoeda(despesas),
        historico: historicoView,
        historicoVazio: historicoView.length === 0,
      });
    } catch (e) {
      // Em erro, exibe dashboard vazio com mensagem
      res.render('dashboard/index', {
        usuarioNome: req.session.usuarioNome,
        saldoFormatado: viewHelper.formatMoeda(0),
        receitasFormatado: viewHelper.formatMoeda(0),
        despesasFormatado: viewHelper.formatMoeda(0),
        historico: [],
        historicoVazio: true,
        erro: e.message,
      });
    }
  }
}

module.exports = new DashboardController();
