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

router.get('/listBlog', blogController.listBlog);
router.post('/delete', blogController.deleteBlog);
router.get('/edit/:id', blogController.getBlogEdit);
router.post('/editBlog', blogController.postBlogEdit);
router.get('/add',blogController.getBlogAdd);
router.post('/addBlog',blogController.postBlogAdd);



module.exports = router;
