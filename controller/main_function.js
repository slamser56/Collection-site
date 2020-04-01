const model = require('../model');
const jwt = require('jsonwebtoken');
const config = require('../config');
const AccountModel = model.account

class VerifyFunction {
    async verify_block(req) {
        return new Promise((resolve, reject) => {
            jwt.verify(req.body.token, config.SESSION_SECRET, async(err, decoded) => {
                if (err) {
                    reject(err)
                } else {
                    try {
                        let account = await AccountModel.findOne({ where: { login: decoded.login } })
                        if (account != null) {
                            if (account.status) {
                                resolve({ status: true, login: decoded.login, admin: account.admin, id: account.id })
                            } else {
                                resolve({ message: 'Blocked!', status: false })
                            }
                        } else {
                            resolve({ message: 'Account not found', status: false })
                        }
                    } catch (err) {
                        reject(err)
                    }
                }
            })
        })
    }
}

module.exports = VerifyFunction