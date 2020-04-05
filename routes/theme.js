const express = require('express');
const router = express.Router();
const Controller = require('../controller');
const ThemeController = new Controller.ThemeController();

router.post('/getAllTheme', ThemeController.find);
router.post('/getOneTheme', ThemeController.findOne);

module.exports = router;