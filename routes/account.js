const express = require('express');
const router = express.Router();
const Controller = require('../controller');
const AccountController = new Controller.AccountPostController();

router.post('/CreateAccount', AccountController.signup);
router.post('/SignIn', AccountController.get);
router.post('/VerifyToken', AccountController.verify);
router.post('/GetAllAccount', AccountController.getAllAccount);
router.post('/DeleteAccount', AccountController.delete);
router.post('/BlockAccount', AccountController.block);
router.post('/UnBlockAccount', AccountController.unblock);
router.post('/SetAdmin', AccountController.setadmin);
router.post('/UnSetAdmin', AccountController.unsetadmin);
router.post('/getProfile', AccountController.getProfile);

module.exports = router;