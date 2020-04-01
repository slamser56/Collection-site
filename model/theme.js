const Sequelize = require('sequelize');
const sequelize = require('../database');

const theme = sequelize.define('theme', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    name_theme: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false
    }
  },{
    timestamps: false
  })


module.exports = theme