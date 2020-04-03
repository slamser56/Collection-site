const express = require('express');
const router = express.Router();
const Controller = require('../controller');
const CommentController = new Controller.CommentController();

router.post('/CreateComment', CommentController.create);
router.post('/GetComment', CommentController.get);

module.exports = router;