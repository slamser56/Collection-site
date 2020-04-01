const model = require('../model')
const VerifyFunction = require('./main_function')
const LikeModel = model.like

const verify_function = new VerifyFunction()

class LikeController {

    async set(req, res) {
        try {
            let verify = await verify_function.verify_block(req)
            if (verify.status) {
                let set = await LikeModel.create({
                    itemId: req.body.itemId,
                    userId: verify.id
                })
                if (set) {
                    res.json({ status: true, execute: true, message: 'Exposed' });
                }
                else {
                    res.json({ status: true, execute: false, message: 'Do not create.' });
                }
            } else {
                return res.json(verify)
            }
        } catch (err) {
            console.log(err)
            return res.json({ status: false, message: 'Something wrong, try later.' })
        }
    }

    async unset(req, res) {
        try {
            let verify = await verify_function.verify_block(req)
            if (verify.status) {
                let destroy = await LikeModel.destroy({
                    where: {
                        itemId: req.body.itemId,
                        userId: verify.id
                    }
                })
                if (destroy) {
                    res.json({ status: true, execute: true, message: 'Uncheck' });
                }
                else {
                    res.json({ status: true, execute: false, message: 'Do not create.' });
                }
            } else {
                return res.json(verify)
            }
        } catch (err) {
            console.log(err)
            return res.json({ status: false, message: 'Something wrong, try later.' })
        }
    }

    async get(req, res) {
        try {
            let find = await LikeModel.findAll({ where: { itemId: req.body.itemId } })
            if (find) {
                let count = 0;
                let like = await Promise.all(find.map(async e => {
                    count++;
                    return ({ userId: e.userId })
                }))
                return res.json({ data: { like, count }, execute: true })
            }
            else {
                res.json({ execute: false, message: 'Do not find.' });
            }
        } catch (err) {
            console.log(err)
            return res.json({ execute: false, message: 'Something wrong, try later.' })
        }
    }



}

module.exports = LikeController 