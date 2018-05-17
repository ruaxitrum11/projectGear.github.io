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
router.get('/list', slideController.list);
router.get('/listSlide', slideController.listSlide);
router.post('/delete', slideController.deleteSlide);
router.get('/edit/:id', slideController.getSlideEdit);
router.post('/edit', slideController.postSlideEdit);
router.post('/addSlide',  slideController.postSlideAdd);



module.exports = router;
