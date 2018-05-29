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
const statisticalController  = require('../../controllers/backend/statisticalController');

// Route is : /admin/statistical/
router.get('/revenue', statisticalController.revenue);
router.get('/status', statisticalController.status);
router.get('/product', statisticalController.product);
router.get('/listIpCancel', statisticalController.listIpCancel);
router.post('/postIpBlock', statisticalController.postIpBlock);
// router.post('/addSlide',  slideController.postSlideAdd);



module.exports = router;
