const model = require('../model')
const VerifyFunction = require('./main_function')
const ItemModel = model.item

const verify_function = new VerifyFunction()

class ItemController {

    async create(req, res) {
        try {
            let verify = await verify_function.verify_block(req)
            if (verify.status) {
                let create = await ItemModel.create({
                    collectionId: req.body.collectionId,
                    data: req.body.data,
                    name: req.body.name
                })
                if (create) {
                    return res.json({ itemId: create.id, status: true, execute: true, message: 'Created.' });
                }
                else {
                    return res.json({ status: true, execute: false, message: 'Do not create.' });
                }
            } else {
                return res.json(verify)
            }
        } catch (err) {
            console.log(err)
            return res.json({ status: false, message: 'Something wrong, try later.' })
        }
    }


    async delete(req, res) {
        try {
            let verify = await verify_function.verify_block(req)
            if (verify.status) {
                let destroy = await ItemModel.destroy({ where: { id: req.body.id } })
                if (destroy) {
                    return res.json({ status: true, execute: true, message: 'Deleted' })
                }
                else {
                    return res.json({ status: true, execute: false, message: 'Do not delete.' });
                }
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
                let find = await ItemModel.findOne({ where: { id: req.body.id } })
                if (find) {
                    let update = await find.update({
                        data: req.body.data,
                        name: req.body.name
                    })
                    if (update) {
                        return res.json({ status: true, execute: true, message: 'Updated' })
                    }
                    else {
                        return res.json({ status: true, execute: false, message: ' do not update' })
                    }
                }
                else {
                    return res.json({ status: true, execute: false, message: 'Do not found.' });
                }
            } else {
                return res.json(verify)
            }
        } catch (err) {
            console.log(err)
            return res.json({ status: false, message: 'Something wrong, try later.' })
        }
    }

    async find(req, res) {
        try {
                let find = await ItemModel.findOne({ where: { id: req.body.id } })
                if (find) {
                    return res.json({
                        execute: true, message: 'Found.', data: {
                            id: find.id,
                            collectionId: find.collectionId,
                            name: find.name,
                            data: find.data,
                            createdAt: find.createdAt,
                            updatedAt: find.updatedAt
                        }
                    })
                }
                else {
                    return res.json({ execute: false, message: 'Do not found.' });
                }

        } catch (err) {
            console.log(err)
            return res.json({ execute: false, message: 'Something wrong, try later.' })
        }
    }

    async findItems(req, res) {
        try {
                let find = await ItemModel.findAll({ where: { collectionId: req.body.id } })
                if (find) {
                    return res.json({
                        execute: true, message: 'Found.', data: find.map(e => {
                            return ({
                                id: e.id,
                                name: e.name,
                                createdAt: e.createdAt,
                                data: e.data
                            })
                        })
                    })
                }
                else {
                    return res.json({ execute: false, message: 'Do not found.' });
                }
            
        } catch (err) {
            console.log(err)
            return res.json({ execute: false, message: 'Something wrong, try later.' })
        }
    }

    async LastAddedItem(req, res) {
        try {
                let item = await ItemModel.findAll({
                    limit: 5,
                    order: [['id', 'DESC']]
                  })
                if (item) {
                    return res.json({
                        execute: true, message: 'Found.', data: item.map(e => {
                            return ({
                                id: e.id,
                                name: e.name,
                                createdAt: e.createdAt
                            })
                        })
                    })
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

module.exports = ItemController