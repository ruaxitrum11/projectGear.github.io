var express = require('express');
var router = express.Router();
const passport = require('passport');
var path = require('path');
const Category = require('../../models/Category');

// console.log ("------------------------");
// console.log(__dirname );
// console.log ("------------------------");
// var dir = path.join(__dirname, '..', 'config');
// const passportConfig = require('../../config/passport');
const homeController = require('../../controllers/frontend/homeController');

// router.use(async (req, res, next) => {
//  	let category = await Category.find({isCategoryMenu : 1 }).sort({createdAt:1}).limit(4).lean()
//  	res.locals.category = category
//  	next()
//  	// return res.render('frontend/index');
//  })

router.get('/', homeController.index);

// router.post('/' , homeController.category);

module.exports = router;
