const Sequelize = require('sequelize')
const sequelize = require('../database')
const item = require('./item')

const collection = sequelize.define('collection', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  name: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  text: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  link_image: {
      type: Sequelize.STRING,
      allowNull: false
    },
    data: {
      type: Sequelize.JSON,
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
  themeId: {
    type: Sequelize.INTEGER,
    references: {
        model: 'themes',
        key: 'id'
    },
    onDelete: "CASCADE"
}
},{
  timestamps: true
})


collection.hasMany(item, { foreignKey: 'collectionId' })

module.exports = collection