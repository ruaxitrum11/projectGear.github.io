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
const productController = require('../../controllers/backend/productController');

// Route is : /admin/product/
router.get('/list', productController.list);
router.get('/listProduct', productController.listProduct);
router.post('/delete', productController.deleteProduct);
router.get('/edit/:id', productController.getProductEdit);
router.post('/edit', productController.postProductEdit);
router.get('/add',productController.getProductAdd);
router.get('/listFileManager',productController.listFileManager);
router.post('/uploadImages', productController.uploadImages);
router.post('/addImageThumb',productController.postProductAddImageThumb);
router.post('/removeImageThumb',productController.postProductRemoveImageThumb);
router.post('/addProduct',  productController.postProductAdd);



module.exports = router;
