const auth = require('./passportRoutes')
const account = require('./account')
const collection = require('./collection')
const item = require('./item')
const comment = require('./comment')
const like = require('./like')
const tag = require('./tag')
const theme = require('./theme')

module.exports = { auth, account, collection, item, comment, like, tag, theme }