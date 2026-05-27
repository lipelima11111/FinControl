const Usuario  = require('./Usuario');
const Categoria = require('./Categoria');
const Transacao = require('./Transacao');

// Associações
Usuario.hasMany(Transacao,   { foreignKey: 'usuario_id',   onDelete: 'CASCADE', as: 'Transacoes' });
Transacao.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'Usuario' });

Categoria.hasMany(Transacao,   { foreignKey: 'categoria_id', as: 'Transacoes' });
Transacao.belongsTo(Categoria, { foreignKey: 'categoria_id', as: 'Categoria' });

module.exports = { Usuario, Categoria, Transacao };
