const model = require('../model')
const VerifyFunction = require('./main_function')
const TagModel = model.tag
const EnrolmentModel = model.enrolment

const verify_function = new VerifyFunction()

class TagController {

    async create(req, res) {
        try {
            let verify = await verify_function.verify_block(req)
            if (verify.status) {
                req.body.data.forEach(async element => {
                    let tag = await TagModel.findOrCreate({ where: { name: element.name } })
                    let enrolment = await EnrolmentModel.findOrCreate({ where: { tagId: tag[0].id, itemId: req.body.itemId } })
                })
                res.json(verify)
            } else {
                return res.json(verify)
            }
        } catch (err) {
            console.log(err)
            return res.json({ status: false, message: 'Something wrong, try later.' })
        }
    }

    async update(req, res) {
        try {
            let verify = await verify_function.verify_block(req)
            if (verify.status) {
                let destroy = await EnrolmentModel.destroy({ where: { itemId: req.body.itemId } })
                req.body.data.forEach(async element => {
                    let tag = await TagModel.findOrCreate({ where: { name: element.name } })
                    let enrolment = await EnrolmentModel.findOrCreate({ where: { tagId: tag[0].id, itemId: req.body.itemId } })
                })
                res.json(verify)
            } else {
                return res.json(verify)
            }
        } catch (err) {
            console.log(err)
            return res.json({ status: false, message: 'Something wrong, try later.' })
        }
    }

    async findalltags(req, res) {
        try {
            let enrolment = await EnrolmentModel.findAll({ where: { itemId: req.body.id } })
            let tag = await Promise.all(enrolment.map(async e => {
                let a = await TagModel.findOne({ where: { id: e.tagId } })
                return ({ id: a.id, name: a.name })
            }))
            return res.json({ data: tag, execute: true, message: 'Found' })
        } catch (err) {
            console.log(err)
            return res.json({ execute: false, message: 'Something wrong, try later.' })
        }
    }

    async getalltags(req, res) {
        try {
            let tag = await TagModel.findAll()
            return res.json({
                data: tag.map(e => {
                    return ({ id: e.id, name: e.name })
                }), status: true, execute: true, message: 'Found'
            })
        } catch (err) {
            console.log(err)
            return res.json({ status: false, message: 'Something wrong, try later.' })
        }
    }

}

module.exports = TagController