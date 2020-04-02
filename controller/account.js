const model = require('../model')
const jwt = require('jsonwebtoken')
const config = require('../config')
const VerifyFunction = require('./main_function')
const AccountModel = model.account

const verify_function = new VerifyFunction()


class AccountPostController {

    async verify(req, res) {
        try {
            let verify = await verify_function.verify_block(req)
            return res.json(verify)
        } catch (err) {
            console.log(err)
            return res.json({ status: false, message: 'Something wrong, try later.' })
        }
    }

    async delete(req, res) {
        try {
            let verify = await verify_function.verify_block(req)
            if (verify.status) {
                let destroy = await AccountModel.destroy({ where: { login: req.body.login } })
                if (destroy) {
                    return res.json({ status: true, execute: true, message: 'Deleted' })
                } else {
                    return res.json({ status: true, execute: false, message: 'Do not delete' })
                }
            } else {
                return res.json(verify)
            }
        } catch (err) {
            console.log(err)
            return res.json({ status: false, message: 'Something wrong, try later.' })
        }
    }

    async getAllAccount(req, res) {
        try {
            let verify = await verify_function.verify_block(req)
            if (verify.status) {
                let alluser = await AccountModel.findAll()
                let UserMap = {}
                alluser.forEach(e => {
                    UserMap[e.id] = {
                        id: e.id,
                        login: e.login,
                        fullname: e.fullname,
                        mail: e.mail,
                        createdAt: e.createdAt,
                        updatedAt: e.updatedAt,
                        status: e.status,
                        admin: e.admin
                    }
                })
                return res.json({ UserMap: UserMap, status: true, execute: true, admin: verify.admin })
            } else {
                return res.json(verify)
            }
        } catch (err) {
            console.log(err)
            return res.json({ status: false, message: 'Something wrong, try later.' })
        }
    }

    async block(req, res) {
        try {
            let verify = await verify_function.verify_block(req)
            if (verify.status) {
                let account = await AccountModel.findOne({ where: { login: req.body.login } })
                if (account) {
                    let update = await account.update({ status: '0' })
                    if (update) {
                        return res.json({ status: true, execute: true, message: 'Blocked' })
                    }
                    return res.json({ status: true, execute: false, message: 'Do not delete' })
                } else {
                    return res.json({ status: true, execute: false, message: 'Do not delete' })
                }
            } else {
                return res.json(verify)
            }
        } catch (err) {
            console.log(err)
            return res.json({ status: false, message: 'Something wrong, try later.' })
        }
    }

    async unblock(req, res) {
        try {
            let verify = await verify_function.verify_block(req)
            if (verify.status) {
                let account = await AccountModel.findOne({ where: { login: req.body.login } })
                if (account) {
                    let update = await account.update({ status: '1' })
                    if (update) {
                        return res.json({ status: true, execute: true, message: 'Unblocked' })
                    }
                    return res.json({ status: true, execute: false, message: 'Do not delete' })
                } else {
                    return res.json({ status: true, execute: false, message: 'Do not delete' })
                }
            } else {
                return res.json(verify)
            }
        } catch (err) {
            console.log(err)
            return res.json({ status: false, message: 'Something wrong, try later.' })
        }
    }

    async setadmin(req, res) {
        try {
            let verify = await verify_function.verify_block(req)
            if (verify.status) {
                let account = await AccountModel.findOne({ where: { login: req.body.login } })
                if (account) {
                    let update = await account.update({ admin: '1' })
                    if (update) {
                        return res.json({ status: true, execute: true, message: 'Setted admin' })
                    }
                    return res.json({ status: true, execute: false, message: 'Do not delete' })
                } else {
                    return res.json({ status: true, execute: false, message: 'Do not delete' })
                }
            } else {
                return res.json(verify)
            }
        } catch (err) {
            console.log(err)
            return res.json({ status: false, message: 'Something wrong, try later.' })
        }
    }

    async unsetadmin(req, res) {
        try {
            let verify = await verify_function.verify_block(req)
            if (verify.status) {
                let account = await AccountModel.findOne({ where: { login: req.body.login } })
                if (account) {
                    let update = await account.update({ admin: '0' })
                    if (update) {
                        return res.json({ status: true, execute: true, message: 'Unsetted admin' })
                    }
                    return res.json({ status: true, execute: false, message: 'Do not delete' })
                } else {
                    return res.json({ status: true, execute: false, message: 'Do not delete' })
                }
            } else {
                return res.json(verify)
            }
        } catch (err) {
            console.log(err)
            return res.json({ status: false, message: 'Something wrong, try later.' })
        }
    }

    async signup(req, res) {
        if (!validateEmail(req.body.mail)) {
            return res.json({ status: false, message: 'Please enter email!', fields: ['mail'] });
        } else if (req.body.login.length < 3 || req.body.login.length > 16) {
            return res.json({ status: false, message: 'Login lenght from 3 to 16 characters!', fields: ['login'] });
        } else if (!/^[a-zA-Z0-9]+$/.test(req.body.login)) {
            return res.json({ status: false, message: 'Latin letters only!', fields: ['login'] });
        } else if (req.body.password !== req.body.repassword) {
            return res.json({ status: false, message: 'Password do not match!', fields: ['password', 'repassword'] });
        } else if (req.body.password.length > 16 || req.body.password.length < 5) {
            return res.json({ status: false, message: 'Password length must be from 5 to 16 characters!', fields: ['password', 'repassword'] });
        } else {
            try {
                let account = await AccountModel.findOne({
                    where: {
                        login: req.body.login
                    }
                })
                if (account != null) {
                    return res.json({ status: false, message: 'Login busy!', fields: ['login'] });
                } else {
                    let create = await AccountModel.create({
                        login: req.body.login,
                        password: req.body.password,
                        fullname: req.body.fullname,
                        mail: req.body.mail,
                        status: true,
                        admin: false
                    })
                    if (create != null) {
                        let token = jwt.sign({ login: req.body.login, id: create.id }, config.SESSION_SECRET, { expiresIn: '24h' });
                        return res.json({ token: token, status: true });
                    } else {
                        res.json({ status: true, message: 'Do not create.' });
                    }
                }
            } catch (err) {
                console.log(err)
                throw res.json({ status: false, message: 'Something wrong, try later.' });
            }
        }
    }

    async get(req, res) {
        if (req.body.login) {
            try {
                let account = await AccountModel.findOne({ where: { login: req.body.login } })
                if (account != null) {
                    if (account.password == req.body.password) {
                        if (account.status) {
                            let token = jwt.sign({ login: req.body.login, id: account.id }, config.SESSION_SECRET, { expiresIn: '24h' });
                            return res.json({ token: token, status: true, id: account.id });
                        } else {
                            return res.json({ status: false, message: 'Account Blocked.' });
                        }
                    } else {
                        return res.json({ status: false, message: 'Incorrect login or password.' });
                    }
                } else {
                    return res.json({ status: false, message: 'Incorrect login or password.' });
                }
            } catch (err) {
                console.log(err)
                throw res.json({ status: false, message: 'Something wrong, try later.' });
            }
        } else {
            return res.json({ status: false, message: 'No input login' });
        }
    }

    async getProfile(req, res) {
        try {
            let account = await AccountModel.findOne({ where: { id: req.body.id } })
            if (account) {
                return res.json({ execute: true, data: account, message: 'Profile Found' })
            } else {
                return res.json({ execute: false, message: 'Do not found' })
            }
        } catch (err) {
            console.log(err)
            return res.json({ execute: false, message: 'Something wrong, try later.' })
        }
    }

}

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}





module.exports = AccountPostController