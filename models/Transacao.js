const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Transacao = sequelize.define('Transacao', {
  descricao:    { type: DataTypes.STRING(255) },
  valor:        { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  data:         { type: DataTypes.DATEONLY, allowNull: false },
  usuario_id:   { type: DataTypes.INTEGER, allowNull: false },
  categoria_id: { type: DataTypes.INTEGER, allowNull: false },
}, {
  tableName: 'transacoes',
  timestamps: false,
});

module.exports = Transacao;
