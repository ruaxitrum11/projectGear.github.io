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
 * GET Category /
 * Laptop.
 */
 exports.category = async (req, res) => {
 	let product = await Product.find({}).lean();
 	let headsetSteelSeries = await Product.find({productSpecies:1 , brand:1}).sort({price:-1}).lean();
 	let headsetRazer = await Product.find({productSpecies:1 , brand:2}).sort({price :-1}).lean();
 	let headsetOzone = await Product.find({productSpecies:1 ,brand:3}).sort({price :-1}).lean();
 	let headsetMSI = await Product.find({productSpecies:1 ,brand:4}).sort({price :-1}).lean();

 	let productKeyboard = await Product.find({productSpecies:2}).lean();
 	let keyboardSteelSeries = await Product.find({productSpecies:2 , brand:1}).sort({price:-1}).lean();
 	let keyboardRazer = await Product.find({productSpecies:2 , brand:2}).sort({price :-1}).lean();
 	let keyboardOzone = await Product.find({productSpecies:2 ,brand:3}).sort({price :-1}).lean();
 	let keyboardMSI = await Product.find({productSpecies:2 ,brand:4}).sort({price :-1}).lean();


 	return res.render('frontend/category.ejs' , 
 	{	
 		product : product ,

 		headsetSteelSeries : headsetSteelSeries , 
 		headsetRazer : headsetRazer,
 		headsetOzone : headsetOzone,
 		headsetMSI : headsetMSI,

 		keyboardSteelSeries : keyboardSteelSeries , 
 		keyboardRazer : keyboardRazer,
 		keyboardOzone : keyboardOzone,
 		keyboardMSI : keyboardMSI
 	});
 }

