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
const specificationsController = require('../../controllers/backend/specificationsController');

// Route is : /admin/specifications/
router.get('/list', specificationsController.list);
router.get('/listSpecifications', specificationsController.listSpecifications);
router.post('/delete', specificationsController.deleteSpecifications);
// // // router.get('/edit/:id', specificationsController.getcolorEdit);
router.post('/edit', specificationsController.postSpecificationsEdit);
router.post('/addSpecifications',  specificationsController.postSpecificationsAdd);



module.exports = router;
