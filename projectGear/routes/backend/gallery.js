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
const galleryController = require('../../controllers/backend/galleryController');

// Route is : /admin/gallery/
router.get('/list', galleryController.list);
router.get('/listGallery', galleryController.listGallery);
router.post('/delete', galleryController.deleteGallery);
// // // router.get('/edit/:id', colorController.getcolorEdit);
// router.post('/edit', colorController.postColorEdit);
router.post('/addGallery',  galleryController.addGallery);



module.exports = router;
