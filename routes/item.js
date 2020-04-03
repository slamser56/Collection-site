const express = require('express');
const router = express.Router();
const Controller = require('../controller');
const ItemController = new Controller.ItemController();

router.post('/CreateItem', ItemController.create);
router.post('/DeleteItem', ItemController.delete);
router.post('/UpdateItem', ItemController.update);
router.post('/FindItem', ItemController.find);
router.post('/FindItems', ItemController.findItems);
router.post('/LastAddedItem', ItemController.LastAddedItem);

module.exports = router;