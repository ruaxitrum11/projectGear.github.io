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
router.get('/list', categoryController.list);
router.get('/listCategory', categoryController.listCategory);
router.post('/delete', categoryController.deleteCategory);
router.get('/edit/:id', categoryController.getCategoryEdit);
router.post('/edit', categoryController.postCategoryEdit);
router.post('/addCategory',  categoryController.postCategoryAdd);



module.exports = router;
