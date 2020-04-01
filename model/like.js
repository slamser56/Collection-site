const Sequelize = require('sequelize');
const sequelize = require('../database');

const like = sequelize.define('like', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  itemId: {
      type: Sequelize.INTEGER,
      references: {
          model: 'items',
          key: 'id'
      },
      onDelete: "CASCADE"
  },
  userId: {
    type: Sequelize.INTEGER,
    references: {
        model: 'accounts',
        key: 'id'
    },
    onDelete: "CASCADE"
}
},{
  timestamps: false
})


module.exports = like