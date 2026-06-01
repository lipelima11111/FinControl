// Model da tabela usuarios (cadastro e login)
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
  nome:         { type: DataTypes.STRING(100), allowNull: false },
  email:        { type: DataTypes.STRING(100), allowNull: false, unique: true },
  senha:        { type: DataTypes.STRING(255), allowNull: false }, // hash bcrypt
  data_criacao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  tableName: 'usuarios',
  timestamps: false,
});

module.exports = Usuario;
