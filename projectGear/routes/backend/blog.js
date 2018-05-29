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
const blogController = require('../../controllers/backend/blogController');

// Route is : /admin/blog/
router.get('/list', blogController.list);

router.get('/listBlog',passportConfig.isAuthAdmin, blogController.listBlog);
router.post('/delete',passportConfig.isAuthAdmin, blogController.deleteBlog);
router.get('/edit/:id',passportConfig.isAuthAdmin, blogController.getBlogEdit);
router.post('/editBlog',passportConfig.isAuthAdmin, blogController.postBlogEdit);
router.get('/add',passportConfig.isAuthAdmin,blogController.getBlogAdd);
router.post('/addBlog',passportConfig.isAuthAdmin,blogController.postBlogAdd);



module.exports = router;
