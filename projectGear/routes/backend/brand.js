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
router.get('/list', brandController.list);
router.get('/listBrand', brandController.listBrand);
router.post('/delete', brandController.deleteBrand);
// router.get('/edit/:id', brandController.getBrandEdit);
router.post('/edit', brandController.postBrandEdit);
router.post('/addBrand',  brandController.postBrandAdd);



module.exports = router;
