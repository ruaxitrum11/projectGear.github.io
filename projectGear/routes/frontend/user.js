var express = require('express');
var router = express.Router();
const passportConfig = require('../../config/passport');
const passport = require('passport');
var path = require('path');
const mongoose = require('mongoose');
// console.log ("------------------------");
// console.log(__dirname );
// console.log ("------------------------");
// var dir = path.join(__dirname, '..', 'config');
// const passportConfig = require('../../config/passport');
const userController = require('../../controllers/frontend/userController');

// Route is : /user/
router.post('/create', userController.validatorCreateUser, userController.create);
router.post('/login',  userController.postLogin);
router.get('/logout', userController.logOut);
router.get('/:userId', userController.getUserInfo);
router.post('/forgotPassword' , userController.forgotPassword);
router.post('/updateUserInfo' , userController.updateUserInfo)
router.post('/showInfoUser' , userController.showInfoUser)
router.post('/showOderHistory' , userController.showOderHistory)
router.post('/upLevelUser' , userController.upLevelUser)
router.post('/confirmCompleted' , userController.confirmCompleted)
router.post('/changePassword' , userController.validatorChangePassword , userController.changePassword)


module.exports = router;