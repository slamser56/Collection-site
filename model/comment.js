const Sequelize = require('sequelize');
const sequelize = require('../database');

const comment = sequelize.define('comment', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
    text: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  userId: {
      type: Sequelize.INTEGER,
      references: {
          model: 'accounts',
          key: 'id'
      },
      onDelete: "CASCADE"
  },
  itemId: {
    type: Sequelize.INTEGER,
    references: {
        model: 'items',
        key: 'id'
    },
    onDelete: "CASCADE"
}
},{
  timestamps: true
})


module.exports = comment