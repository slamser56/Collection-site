const sequelize = require('../database')
const account = require('./account')
const theme = require('./theme')
const collection = require('./collection')
const item = require('./item')
const comment = require('./comment')
const like = require('./like')
const tag = require('./tag')
const enrolment = require('./enrolment')

sequelize.sync().then(res =>{
console.log('Table verified')
}).catch(err =>{
console.log(err)
process.exit(1)
})
module.exports = { account, collection, theme, item, comment, like, tag, enrolment }