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

const Category = require('../../models/Category');

// Method
/**
 * GET Category /
 * Laptop.
 */
 exports.aboutUs = async (req, res) => {


 	let categoryMenu = await Category.find({isCategoryMenu : 1 , status : 1}).sort({createdAt:1}).limit(4).lean();
 	let categoryDropDown = await Category.find({isCategoryMenu : 0 , status : 1} ).sort({createdAt:1}).lean();
 	// let blog = await Blog.find({status:1}).sort({createdAt:-1}).lean()


 	// console.log(count)
 	// console.log("=====")
 	// console.log(blog)

 	return res.render('frontend/aboutUs' , {
 		categoryMenu : categoryMenu , 
 		categoryDropDown : categoryDropDown,
 	
 	});

 }



