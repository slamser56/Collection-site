const express = require('express');
const router = express.Router();
const Controller = require('../controller');
const CollectionController = new Controller.CollectionController();
const UploadImage = new Controller.UploadImage();

router.post('/CreateCollection', CollectionController.create);
router.post('/DeleteCollection', CollectionController.delete);
router.post('/UpdateCollection', CollectionController.update);
router.post('/FindCollection', CollectionController.find);
router.post('/GetCollectionUser', CollectionController.GetCollectionUser);
router.post('/CollectionMostItem', CollectionController.CollectionMostItem);
router.post('/search', CollectionController.search);

router.post('/UploadImage', UploadImage.upload);

module.exports = router;