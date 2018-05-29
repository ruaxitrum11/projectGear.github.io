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
const slideController = require('../../controllers/backend/slideController');

// Route is : /admin/slide/
router.get('/list',passportConfig.isAuthAdmin, slideController.list);
router.get('/listSlide',passportConfig.isAuthAdmin, slideController.listSlide);
router.post('/delete',passportConfig.isAuthAdmin, slideController.deleteSlide);
router.get('/edit/:id',passportConfig.isAuthAdmin, slideController.getSlideEdit);
router.post('/edit',passportConfig.isAuthAdmin, slideController.postSlideEdit);
router.post('/addSlide', passportConfig.isAuthAdmin, slideController.postSlideAdd);



module.exports = router;
