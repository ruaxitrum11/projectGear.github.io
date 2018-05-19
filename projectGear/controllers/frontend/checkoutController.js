/***********************
 * Module dependencies.
 **********************/
 const cluster = require('cluster');
 const request = require('request');
 const _ = require('lodash');
 const fs = require('fs');
 const download = require('download');
 const async = require('async');
 const moment = require('moment');
 const path = require('path');

// Models
const User = require('../../models/User');
const Product = require('../../models/Product');
const Category = require('../../models/Category');
const Blog = require('../../models/Blog');
// Method
/**
 * GET Category /
 * Laptop.
 */
 exports.checkout = async (req, res) => {
 	let categoryMenu = await Category.find({isCategoryMenu : 1 , status : 1}).sort({createdAt:1}).limit(4).lean();
 	let categoryDropDown = await Category.find({isCategoryMenu : 0 , status : 1} ).sort({createdAt:1}).lean();
 	let category = await Category.find({status:1}).sort({createdAt:1}).lean();

 	return res.render('frontend/checkout.ejs', {
 		categoryMenu : categoryMenu , 
 		categoryDropDown : categoryDropDown,
 		category : category ,
 	});
 }



