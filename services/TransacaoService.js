const { Transacao, Categoria } = require('../models');

class TransacaoService {
  async cadastrar({ descricao, valor, data, categoria_id, usuario_id }) {
    return Transacao.create({ descricao, valor, data, categoria_id, usuario_id });
  }

  async atualizar(id, usuario_id, { descricao, valor, data, categoria_id }) {
    const transacao = await Transacao.findOne({ where: { id, usuario_id } });
    if (!transacao) throw new Error('Transação não encontrada.');
    return transacao.update({ descricao, valor, data, categoria_id });
  }

  async deletar(id, usuario_id) {
    const transacao = await Transacao.findOne({ where: { id, usuario_id } });
    if (!transacao) throw new Error('Transação não encontrada.');
    return transacao.destroy();
  }

  async buscarPorId(id, usuario_id) {
    return Transacao.findOne({
      where: { id, usuario_id },
      include: [{ model: Categoria, as: 'Categoria' }],
    });
  }
}

module.exports = new TransacaoService();
