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
const reviewController = require('../../controllers/backend/reviewController');

// Route is : /admin/review/
router.get('/list',passportConfig.isAuthAdmin, reviewController.list);

router.get('/listReview', passportConfig.isAuthAdmin,reviewController.listReview);
router.post('/delete', passportConfig.isAuthAdmin,reviewController.deleteReview);
router.get('/edit/:id',passportConfig.isAuthAdmin, reviewController.getReviewEdit);
router.post('/editReview',passportConfig.isAuthAdmin, reviewController.postReviewEdit);
router.get('/add',passportConfig.isAuthAdmin,reviewController.getReviewAdd);
router.post('/addReview',passportConfig.isAuthAdmin,reviewController.postReviewAdd);



module.exports = router;
