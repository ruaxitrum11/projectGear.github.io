var express = require('express');
var router = express.Router();
const passport = require('passport');
var path = require('path');
// console.log ("------------------------");
// console.log(__dirname );
// console.log ("------------------------");
// var dir = path.join(__dirname, '..', 'config');
// const passportConfig = require('../../config/passport'); 


const blogController = require('../../controllers/frontend/blogController');

// Route is : /blog

router.get('/:page', blogController.blog);
router.get('/details/:id', blogController.blogInfo);



module.exports = router;
