const express = require('express');
const router = express.Router();
const passport = require('passport');
const Controller = require('../controller')

const googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] })
const githubAuth = passport.authenticate('github')

router.get('/auth/google/callback', googleAuth, Controller.authController.google);
router.get('/auth/github/callback', githubAuth, Controller.authController.github);

router.use((req, res, next) => {
  req.session.socketId = req.query.socketId
  next()
})

router.get('/auth/google', googleAuth);
router.get('/auth/github', githubAuth);

module.exports = router;