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
router.post('/forgotPassword' , userController.forgotPassword);


router.get('/:userId', passportConfig.isAuthenticated , userController.getUserInfo);
router.post('/updateUserInfo' ,passportConfig.isAuthenticated, userController.updateUserInfo)
// router.post('/showInfoUser' , userController.showInfoUser)


router.get('/order/:userId' , passportConfig.isAuthenticated, userController.getOrderHistory)
router.get('/showOrderHistory/list' , passportConfig.isAuthenticated, userController.showOderHistory)
router.post('/order/confirmCompleted' ,passportConfig.isAuthenticated, userController.confirmCompleted)

router.get('/trophy/:userId' , passportConfig.isAuthenticated, userController.getTrophy)
router.post('/upLevelUser' ,passportConfig.isAuthenticated, userController.upLevelUser)

router.get('/change-pass/:userId' , passportConfig.isAuthenticated, userController.getChangePass)
router.post('/changePassword' ,passportConfig.isAuthenticated, userController.validatorChangePassword , userController.changePassword)

module.exports = router;