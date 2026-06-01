// Centraliza models e define relacionamentos (1 usuário → N transações)
const Usuario  = require('./Usuario');
const Categoria = require('./Categoria');
const Transacao = require('./Transacao');

Usuario.hasMany(Transacao,   { foreignKey: 'usuario_id',   onDelete: 'CASCADE', as: 'Transacoes' });
Transacao.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'Usuario' });

Categoria.hasMany(Transacao,   { foreignKey: 'categoria_id', as: 'Transacoes' });
Transacao.belongsTo(Categoria, { foreignKey: 'categoria_id', as: 'Categoria' });

module.exports = { Usuario, Categoria, Transacao };
