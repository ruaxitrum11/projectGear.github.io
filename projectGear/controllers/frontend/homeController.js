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
// Method
/**
 * GET /
 * Home page.
 */
 exports.index = async (req, res) => {
 	let product = await Product.find({}).sort({numberPurchased:-1}).limit(3).lean();
 	return res.render('frontend/index' , {product:product});
 	console.log(product);
 }
