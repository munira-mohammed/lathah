const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController');

router.get('/homePage', mainController.homepage);

module.exports = router;