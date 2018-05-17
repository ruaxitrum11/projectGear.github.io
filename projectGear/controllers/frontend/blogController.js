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
 exports.blog = async (req, res) => {
 	var limit = 10;
 	var page = req.params.page || 1 ;
 	var skip = limit*(page-1);



 	let categoryMenu = await Category.find({isCategoryMenu : 1 , status : 1}).sort({createdAt:1}).limit(4).lean();
 	let categoryDropDown = await Category.find({isCategoryMenu : 0 , status : 1} ).sort({createdAt:1}).lean();
 	// let blog = await Blog.find({status:1}).sort({createdAt:-1}).lean()

 	let [count, blog] = await Promise.all([
 		Blog.count({status:1}),
 		Blog.find({status:1}).sort({createdAt : -1}).skip(skip).limit(limit)
 		])

 	var totalPage = Math.ceil(count/limit)
 	// console.log(count)
 	// console.log("=====")
 	// console.log(blog)

 	return res.render('frontend/blog' , {
 		categoryMenu : categoryMenu , 
 		categoryDropDown : categoryDropDown,
 		blog : blog ,
 		totalPage : totalPage ,
 		page : page ,
 		moment : moment
 	});

 }



