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
const categoryController = require('../../controllers/backend/categoryController');

// Route is : /admin/category/
router.get('/list',passportConfig.isAuthAdmin, categoryController.list);
router.get('/listCategory', passportConfig.isAuthAdmin,categoryController.listCategory);
router.post('/delete',passportConfig.isAuthAdmin, categoryController.deleteCategory);
router.get('/edit/:id', passportConfig.isAuthAdmin,categoryController.getCategoryEdit);
router.post('/edit',passportConfig.isAuthAdmin, categoryController.postCategoryEdit);
router.post('/addCategory', passportConfig.isAuthAdmin, categoryController.postCategoryAdd);
router.post('/uploadCategoryBanner',passportConfig.isAuthAdmin, categoryController.uploadCategoryBanner);

module.exports = router;
