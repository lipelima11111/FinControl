const { Transacao, Categoria } = require('../models');

class DashboardService {
  async calcularSaldoTotal(usuarioId) {
    const transacoes = await Transacao.findAll({
      where: { usuario_id: usuarioId },
      include: [{ model: Categoria, as: 'Categoria' }],
    });

    let receitas = 0;
    let despesas = 0;

    transacoes.forEach(t => {
      const valor = parseFloat(t.valor);
      if (t.Categoria.tipo === 'receita') receitas += valor;
      else despesas += valor;
    });

    return { saldo: receitas - despesas, receitas, despesas };
  }

  async buscarHistorico(usuarioId) {
    return Transacao.findAll({
      where: { usuario_id: usuarioId },
      include: [{ model: Categoria, as: 'Categoria' }],
      order: [['data', 'DESC'], ['id', 'DESC']],
    });
  }
}

module.exports = new DashboardService();
