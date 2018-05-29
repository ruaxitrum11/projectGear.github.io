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
router.get('/list',passportConfig.isAuthAdmin, productController.list);
router.get('/listProduct', passportConfig.isAuthAdmin,productController.listProduct);
router.get('/listProductStatistical',passportConfig.isAuthAdmin, productController.listProductStatistical);
router.post('/delete',passportConfig.isAuthAdmin, productController.deleteProduct);
router.get('/edit/:id', passportConfig.isAuthAdmin,productController.getProductEdit);
router.post('/edit',passportConfig.isAuthAdmin,productController.validatorProductEdit, productController.postProductEdit);
router.get('/add',passportConfig.isAuthAdmin,productController.getProductAdd);
router.post('/addProduct',passportConfig.isAuthAdmin, productController.validatorProductAdd , productController.postProductAdd);

// Route is : /admin/product/
 //Modal ProductThumb
router.get('/listFileManager',passportConfig.isAuthAdmin,productController.listFileManager);
router.post('/uploadImages',passportConfig.isAuthAdmin, productController.uploadImages);
router.post('/removeImageThumb',passportConfig.isAuthAdmin,productController.postProductRemoveImageThumb);


// Route is : /admin/product/
 //Modal ProductImages
router.get('/listFileManagerImages',passportConfig.isAuthAdmin,productController.listFileManagerImages);




module.exports = router;
