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
const userController = require('../../controllers/backend/userController');

// Route is : /admin/user/
router.get('/list',passportConfig.isAuthAdmin,  userController.list);
router.get('/listUser',passportConfig.isAuthAdmin, userController.listUser);
router.post('/delete',passportConfig.isAuthAdmin, userController.deleteUser);
router.get('/edit/:id',passportConfig.isAuthAdmin, userController.getUserEdit);
router.post('/edit',passportConfig.isAuthAdmin, userController.validatorUserEdit, userController.postUserEdit);
router.get('/add',passportConfig.isAuthAdmin,userController.getUserAdd);
router.post('/addUser', passportConfig.isAuthAdmin,userController.validatorUserAdd, userController.postUserAdd);

router.post('/uploadAvatar',passportConfig.isAuthAdmin, userController.uploadAvatar);



router.get('/ipblocked', passportConfig.isAuthAdmin, userController.listBlocked);
router.get('/listIpBlocked',passportConfig.isAuthAdmin, userController.listIpBlocked);
router.post('/postIpBlocked', passportConfig.isAuthAdmin,userController.postIpBlocked);
router.post('/removeIpBlocked', passportConfig.isAuthAdmin,userController.removeIpBlocked);

module.exports = router;
