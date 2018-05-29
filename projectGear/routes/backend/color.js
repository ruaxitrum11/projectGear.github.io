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
const colorController = require('../../controllers/backend/colorController');

// Route is : /admin/color/
router.get('/list',passportConfig.isAuthAdmin, colorController.list);
router.get('/listColor',passportConfig.isAuthAdmin, colorController.listColor);
router.post('/delete',passportConfig.isAuthAdmin, colorController.deleteColor);
// // router.get('/edit/:id', colorController.getcolorEdit);
router.post('/edit',passportConfig.isAuthAdmin, colorController.postColorEdit);
router.post('/addColor', passportConfig.isAuthAdmin, colorController.postColorAdd);



module.exports = router;
