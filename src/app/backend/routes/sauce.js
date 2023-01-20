const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')
const sauceCtrl = require('../controllers/sauce')

router.get('/sauces', auth, sauceCtrl.getAllSauce)
router.post('/sauces', auth, multer, sauceCtrl.newSauce)

  module.exports = router