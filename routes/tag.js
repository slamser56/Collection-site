const express = require('express');
const router = express.Router();
const Controller = require('../controller');
const TagController = new Controller.TagController();

router.post('/CreateTag', TagController.create);
router.post('/FindTags', TagController.findalltags);
router.post('/GetAllTags', TagController.getalltags);
router.post('/UpdateTags', TagController.update);

module.exports = router;