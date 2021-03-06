const express = require('express');
const router = express.Router();
const Controller = require('../controller');
const ItemController = new Controller.ItemController();

router.post('/CreateItem', ItemController.create);
router.post('/DeleteItem', ItemController.delete);
router.post('/UpdateItem', ItemController.update);
router.post('/getItem', ItemController.find);
router.post('/getUserItems', ItemController.findItems);
router.post('/LastAddedItem', ItemController.LastAddedItem);

module.exports = router;