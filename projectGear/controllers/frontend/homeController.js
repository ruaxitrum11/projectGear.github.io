/***********************
 * Module dependencies.
 **********************/
 const cluster = require('cluster');
 const request = require('request');
 const _ = require('lodash');
 const fs = require('fs');
 const download = require('download');
 const async = require('async');

// Models
const User = require('../../models/User');
const Product = require('../../models/Product');
const Category = require('../../models/Category');
const Brand = require('../../models/Brand');
const Color = require('../../models/Color');
// Method
/**
 * GET /
 * Home page.
 */
 exports.index = async (req, res) => {
 	// let productHeadset = await Product.find({}).sort({numberPurchased:-1}).limit(3).lean();
 	// let productKeyboard = await Product.find({}).sort({numberPurchased :-1}).limit(3).lean();
 	// let productMouse = await Product.find({}).sort({numberPurchased :-1}).limit(3).lean();
 	// let productLaptop = await Product.find({}).sort({numberPurchased :-1}).limit(3).lean();
 	let categoryMenu = await Category.find({isCategoryMenu : 1 , status : 1}).sort({createdAt:1}).limit(4).lean();
 	let categoryDropDown = await Category.find({isCategoryMenu : 0 , status : 1} ).sort({createdAt:1}).lean();
 	let category = await Category.find({status:1}).sort({createdAt:1}).lean();
 	let product = await Product.find({}).populate('productCategory').sort({numberPurchased:-1}).limit(3).lean();
 	console.log(product);
 	
 	
 	// let product = await Product.find({}).sort({numberPurchased:-1}).limit(3).lean()
 	return res.render('frontend/index' , {
 		categoryMenu : categoryMenu , 
 		categoryDropDown : categoryDropDown,
 		category : category ,
 		product : product
 	});
 }

// exports.category = async(req,res) => {
// 	console.log(req.body);
// 	if (req.body) {
// 		return res.send({status:true})
// 	}
// }