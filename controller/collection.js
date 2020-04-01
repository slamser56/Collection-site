const model = require('../model')
const VerifyFunction = require('./main_function')
const CollectionModel = model.collection
const ThemeModel = model.theme
const ItemModel = model.item
const CommentModel = model.comment
const TagModel = model.tag
const sequelize = require('sequelize')

const verify_function = new VerifyFunction()

class CollectionController {

    async create(req, res) {
        try {
            let verify = await verify_function.verify_block(req)
            if (verify.status) {
                let create = await CollectionModel.create({
                    link_image: req.body.link_image,
                    name: req.body.name,
                    text: req.body.text,
                    themeId: req.body.themeId,
                    userId: req.body.id,
                    data: req.body.data
                })
                if (create) {
                    res.json({ status: true, execute: true, message: 'Created.' });
                } else {
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


    async delete(req, res) {
        try {
            let verify = await verify_function.verify_block(req)
            if (verify.status) {
                let destroy = await CollectionModel.destroy({ where: { id: req.body.id } })
                if (destroy) {
                    return res.json({ status: true, execute: true, message: 'Deleted' })
                } else {
                    res.json({ status: true, execute: false, message: 'Do not delete.' });
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
                let find = await CollectionModel.findOne({ where: { id: req.body.id } })
                console.log(req.body)
                if (find) {
                    let update = await find.update({
                        link_image: req.body.link_image,
                        name: req.body.name,
                        text: req.body.text,
                        themeId: req.body.themeId,
                        data: req.body.data
                    })
                    if (update) {
                        return res.json({ status: true, execute: true, message: 'Updated' })
                    } else {
                        return res.json({ status: true, execute: false, message: ' do not update' })
                    }
                } else {
                    res.json({ status: true, execute: false, message: 'Do not find index.' });
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
            let find = await CollectionModel.findOne({ where: { id: req.body.id } })
            if (find) {
                res.json({
                    execute: true,
                    message: 'Found.',
                    data: {
                        id: find.id,
                        link_image: find.link_image,
                        name: find.name,
                        text: find.text,
                        themeId: find.themeId,
                        userId: find.userId,
                        data: find.data,
                        createdAt: find.createdAt,
                        updatedAt: find.updatedAt
                    }
                })
            } else {
                res.json({ execute: false, message: 'Do not find collection.' });
            }
        } catch (err) {
            console.log(err)
            return res.json({ status: false, message: 'Something wrong, try later.' })
        }
    }

    async GetCollectionUser(req, res) {
        try {
            let find = await ThemeModel.findAll({
                include: [{
                    model: CollectionModel,
                    as: 'collections',
                    where: { userId: req.body.id }
                }]
            })
            if (find) {
                let data = []
                find.map(e => {
                    return e.collections.map(el => {
                        data.push({
                            id: el.id,
                            link_image: el.link_image,
                            name: el.name,
                            text: el.text,
                            themeId: el.themeId,
                            userId: el.id,
                            data: el.data,
                            createdAt: el.createdAt,
                            updatedAt: el.updatedAt,
                            theme: e.name_theme
                        })
                    })
                })
                return res.json({ data: data, execute: true })
            } else {
                res.json({ execute: false, message: 'Do not find collection.' });
            }
        } catch (err) {
            console.log(err)
            return res.json({ execute: false, message: 'Something wrong, try later.' })
        }
    }

    async CollectionMostItem(req, res) {
        try {
            let count = await ItemModel.findAll({
                attributes: ['collectionId', [sequelize.fn('count', sequelize.col('collectionId')), 'count']],
                group: ['collectionId'],
                order: [[sequelize.literal('count'), 'DESC']],
                limit: 5,
                raw: true
            })
            let collection = await Promise.all(count.map(async e => {
                return await CollectionModel.findAll({ where: { id: e.collectionId }, raw: true, attributes: ['id', 'name', 'createdAt'] })
            }))
            return res.json({ execute: true, data: collection, message: 'Found' })
        } catch (err) {
            console.log(err)
            return res.json({ execute: false, message: 'Something wrong, try later.' })
        }
    }

    async search(req, res) {
        try {
            let search = await CollectionModel.findAll({
                attributes: ['name', 'text', 'items.id'],
                include: [{
                    model: ItemModel,
                    attributes: ['id', 'name'],
                    include: [{
                        model: CommentModel,
                        attributes: ['text']
                    }, {
                        all: true
                    }]
                }],
                where: {
                    [sequelize.Op.or]: [
                        { 'text': { [sequelize.Op.like]: '%' + req.body.text + '%' } },
                        { 'name': { [sequelize.Op.like]: '%' + req.body.text + '%' } },
                        { '$items.name$': { [sequelize.Op.like]: '%' + req.body.text + '%' } },
                        { '$items.comments.text$': { [sequelize.Op.like]: '%' + req.body.text + '%' } },
                        { '$items.tags.name$': { [sequelize.Op.like]: '%' + req.body.text + '%' } }
                    ]
                },
                group: ['items.id'],
                raw: true
            })
            let data = [] 
            search.forEach(e => {
                if (e.id)
                    data.push({ id: e.id, name: e['items.name'] })
            })

            return res.json({
                data: data
            })

        } catch (err) {
            console.log(err)
            return res.json({ execute: false, message: 'Something wrong, try later.' })
        }
    }

}

module.exports = CollectionController