const Sequelize = require('sequelize')
const sequelize = require('../database')

const tag = sequelize.define('tag', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
    name: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  }
},{
  timestamps: false
})



module.exports = tag