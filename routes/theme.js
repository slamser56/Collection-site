const express = require('express');
const router = express.Router();
const Controller = require('../controller');
const ThemeController = new Controller.ThemeController();

router.post('/FindTheme', ThemeController.find);
router.post('/FindThemeOne', ThemeController.findOne);

module.exports = router;