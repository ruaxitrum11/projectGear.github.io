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
const billController = require('../../controllers/backend/billController');

// Route is : /admin/bill/
router.get('/list',passportConfig.isAuthAdmin, billController.list);

router.get('/listBill',passportConfig.isAuthAdmin, billController.listBill);
// router.post('/delete', billController.deleteBlog);
router.get('/edit/:id',passportConfig.isAuthAdmin, billController.getBillInfo);
router.post('/edit',passportConfig.isAuthAdmin, billController.postBillEdit);
// router.get('/add',billController.getBlogAdd);
// router.post('/addBlog',billController.postBlogAdd);



module.exports = router;
