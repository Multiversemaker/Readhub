const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('ediglib', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = sequelize;