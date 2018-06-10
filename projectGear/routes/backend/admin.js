var express = require('express');
var router = express.Router();
const passportConfig = require('../../config/passport');
const passport = require('passport');
var path = require('path');
// console.log ("------------------------");
// console.log(__dirname );
// console.log ("------------------------");
// var dir = path.join(__dirname, '..', 'config');

const adminController = require('../../controllers/backend/adminController');


router.get('/',passportConfig.isAuthAdmin, adminController.admin);
router.post('/revenue' , passportConfig.isAuthAdmin, adminController.revenue)
router.get('/revenue/creatExcelFile' , passportConfig.isAuthAdmin, adminController.creatExcelFile)
router.get('/countTotal' ,passportConfig.isAuthAdmin, adminController.countTotal)


module.exports = router;

