const Sequelize = require('sequelize');
const sequelize = require('../database');

const enrolment = sequelize.define('enrolment', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  }
},{
  timestamps: false
})

module.exports = enrolment