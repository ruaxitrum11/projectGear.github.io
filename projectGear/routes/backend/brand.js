var express = require('express');
var router = express.Router();
var multer = require('multer');
const passportConfig = require('../../config/passport');
const passport = require('passport');
var path = require('path');
const mongoose = require('mongoose');
// console.log ("------------------------");
// console.log(__dirname );
// console.log ("------------------------");
// var dir = path.join(__dirname, '..', 'config');
// const passportConfig = require('../../config/passport');
const brandController = require('../../controllers/backend/brandController');

// Route is : /admin/brand/
router.get('/list',passportConfig.isAuthAdmin, brandController.list);
router.get('/listBrand',passportConfig.isAuthAdmin, brandController.listBrand);
router.post('/delete',passportConfig.isAuthAdmin, brandController.deleteBrand);
// router.get('/edit/:id', brandController.getBrandEdit);
router.post('/edit',passportConfig.isAuthAdmin, brandController.postBrandEdit);
router.post('/addBrand', passportConfig.isAuthAdmin, brandController.postBrandAdd);



module.exports = router;
