const express = require('express');
const router = express.Router();
const Controller = require('../controller');
const LikeController = new Controller.LikeController();

router.post('/SetLike', LikeController.set);
router.post('/UnSetLike', LikeController.unset);
router.post('/GetLike', LikeController.get);

module.exports = router;