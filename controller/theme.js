const model = require('../model')
const VerifyFunction = require('./main_function')
const ThemeModel = model.theme

const verify_function = new VerifyFunction()

class ThemeController {

    async find(req,res){
        try {
                let allTheme = await ThemeModel.findAll()
                let ThemeMap = {}
                allTheme.forEach(e => {
                    ThemeMap[e.id] = {
                        id: e.id,
                        name_theme: e.name_theme
                    }
                })
                    res.json({execute: true, message: 'Found.', theme: ThemeMap})
        } catch (err) {
            console.log(err)
            return res.json({ execute: false, message: 'Something wrong, try later.' })
        }
    }

    async findOne(req,res){
        try {
                let Theme = await ThemeModel.findOne({ where: { id: req.body.id } })
                    res.json({execute: true, message: 'Found.', theme: Theme})
        } catch (err) {
            console.log(err)
            return res.json({ execute: false, message: 'Something wrong, try later.' })
        }
    }

}

module.exports = ThemeController