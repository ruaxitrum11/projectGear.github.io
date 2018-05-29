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
const productController = require('../../controllers/frontend/productController');

// Route is : /product
router.get('/:id', productController.product);
router.post('/showProduct' , productController.showProduct)
router.post('/addToCart',productController.addToCart)
router.post('/changeColor',productController.changeColor)

router.get('/search/product',productController.search)

router.post('/countRead', productController.countRead);




module.exports = router;
