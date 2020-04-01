const Sequelize = require('sequelize')
const sequelize = require('../database')
const collection = require('./collection')
const comment = require('./comment')
const like = require('./like')
const theme = require('./theme')

const account = sequelize.define('account', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    login: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    fullname: {
        type: Sequelize.TEXT,
        allowNull: false
      },
    mail: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    status:{
      type: Sequelize.BOOLEAN,
      allowNull: false
    },
    admin:{
      type: Sequelize.BOOLEAN,
      allowNull: false
    }
  },{
    timestamps: true
  })

account.hasMany(collection, { foreignKey: 'userId' })
theme.hasMany(collection, { foreignKey: 'themeId' })
account.hasMany(comment, { foreignKey: 'userId' })
account.hasMany(like, { foreignKey: 'userId' })

module.exports = account