const model = require('../model')
const VerifyFunction = require('./main_function')
const CommentModel = model.comment
const AccountModel = model.account

const verify_function = new VerifyFunction()

class CommentController {

    async create(req, res) {
        try {
            let verify = await verify_function.verify_block(req)
            if (verify.status) {
                let create = await CommentModel.create({
                    itemId: req.body.itemId,
                    text: req.body.text,
                    userId: verify.id
                })
                if (create) {
                    return ({
                        status: true, data: {
                            itemId: req.body.itemId,
                            text: req.body.text,
                            userId: verify.id,
                            createdAt: create.createdAt,
                            login: verify.login
                        }, execute: true, message: 'Created.'
                    });
                }
                else {
                    return ({ status: true, execute: false, message: 'Do not create.' });
                }
            } else {
                return (verify)
            }
        } catch (err) {
            console.log(err)
            return ({ status: false, message: 'Something wrong, try later.' })
        }
    }

    async get(req, res) {
        try {
            let find = await CommentModel.findAll({ where: { itemId: req.body.id }, order: [['id', 'ASC']] })
            if (find) {
                let data = await Promise.all(find.map(async e => {
                    let user = await AccountModel.findOne({ where: { id: e.userId } })
                    return ({
                        login: user.login,
                        text: e.text,
                        userId: e.userId,
                        createdAt: e.createdAt
                    })
                }))
                return res.json({ data: data, execute: true, message: 'Created' })
            }
            else {
                return res.json({ execute: false, message: 'Do not found.' });
            }

        } catch (err) {
            console.log(err)
            return res.json({ execute: false, message: 'Something wrong, try later.' })
        }
    }



}

module.exports = CommentController 