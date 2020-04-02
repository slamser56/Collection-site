const jwt = require('jsonwebtoken')
const generatePassword = require('password-generator');
const config = require('../config')
const model = require('../model')
const AccountModel = model.account

exports.google = async (req, res) => {
    const io = req.app.get('io')
    var token
    try {
        let account = await AccountModel.findOne({ where: { login: 'Gooogle:'+req.user._json.email } })
        if (account) {
            token = jwt.sign({ login: account.login, id: account.id }, config.SESSION_SECRET, { expiresIn: '24h' });
        } else {
            let create = await AccountModel.create({
                login: 'Gooogle:'+req.user._json.email,
                password: generatePassword(14, false),
                fullname: req.user._json.name,
                mail: req.user._json.email,
                status: true,
                admin: false
            })
            token = jwt.sign({ login: create.login, id: create.id }, config.SESSION_SECRET, { expiresIn: '24h' });
        }
    } catch (err) {
        console.log(err)
    }
    io.in(req.session.socketId).emit('auth', { token: token })
    res.end()
}

exports.github = async (req, res) => {
    const io = req.app.get('io')
    var token
    try {
        let account = await AccountModel.findOne({ where: { login: 'GiHub:'+req.user._json.login } })
        if (account) {
            token = jwt.sign({ login: account.login, id: account.id }, config.SESSION_SECRET, { expiresIn: '24h' });
        } else {
            let create = await AccountModel.create({
                login: 'GiHub:'+req.user._json.login,
                password: generatePassword(14, false),
                fullname: req.user._json.name,
                mail: req.user._json.email,
                status: true,
                admin: false
            })
            token = jwt.sign({ login: create.login, id: create.id }, config.SESSION_SECRET, { expiresIn: '24h' });
        }
    } catch (err) {
        console.log(err)
    }
    io.in(req.session.socketId).emit('auth', { token: token })
    res.end()
} 