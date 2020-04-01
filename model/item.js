const Sequelize = require('sequelize')
const sequelize = require('../database')
const comment = require('./comment')
const like = require('./like')
const tag = require('./tag')
const enrolment = require('./enrolment')

const item = sequelize.define('item', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
    name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  data: {
      type: Sequelize.JSON,
      allowNull: false
    },
  collectionId: {
      type: Sequelize.INTEGER,
      references: {
          model: 'collections',
          key: 'id'
      },
      onDelete: "CASCADE"
  }
},{
  timestamps: true
})

item.hasMany(comment, { foreignKey: 'itemId' })
item.hasMany(like, { foreignKey: 'itemId' })
item.belongsToMany(tag, {through: enrolment});
tag.belongsToMany(item, {through: enrolment});



module.exports = item