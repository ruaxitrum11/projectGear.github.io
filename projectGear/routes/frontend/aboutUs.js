var express = require('express');
var router = express.Router();
const passport = require('passport');
var path = require('path');
// console.log ("------------------------");
// console.log(__dirname );
// console.log ("------------------------");
// var dir = path.join(__dirname, '..', 'config');
// const passportConfig = require('../../config/passport'); 


const aboutUsController = require('../../controllers/frontend/aboutUsController');

// Route is : /aboutUs

// router.post('/checkout', blogController.blog);
router.get('/',aboutUsController.aboutUs)

module.exports = router;
