// Model da tabela categorias (receita ou despesa)
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Categoria = sequelize.define('Categoria', {
  nome: { type: DataTypes.STRING(50), allowNull: false },
  tipo: { type: DataTypes.ENUM('receita', 'despesa'), allowNull: false },
}, {
  tableName: 'categorias',
  timestamps: false,
});

module.exports = Categoria;
