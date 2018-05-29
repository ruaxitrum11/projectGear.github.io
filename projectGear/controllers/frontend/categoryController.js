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
const Review = require('../../models/Review');
// Method
/**
 * GET Category /
 * Laptop.
 */
 exports.category = async (req, res) => {
 	let categoryMenu = await Category.find({isCategoryMenu : 1 , status : 1}).sort({createdAt:1}).limit(4).lean();
 	let categoryDropDown = await Category.find({isCategoryMenu : 0 , status : 1} ).sort({createdAt:1}).lean();
 	let category = await Category.find({status:1}).sort({createdAt:1}).lean();
 	let brand = await Brand.find({status:1}).sort({createdAt:1}).lean();
 	// let productFirst = await Product.find({}).populate('productCategory').sort({createdAt:-1}).limit(3).lean();

	// console.log(req.params.summary) 	
	let categoryCurrent = await Category.find({categoryNameSummary : req.params.summary})

	let review = await Review.find({status:1}).sort({createdAt:-1}).lean();

	// console.log(categoryCurrent)
	// console.log(categoryCurrent[0]._id)
	let categoryCurrentId =  categoryCurrent[0]._id
	


	let product = await Product.find({productCategory : categoryCurrentId , status:1})
	.populate('productColor.colorId').sort({createdAt:-1}).lean();

	let categoryBanner = await Category.find({_id : {$ne : categoryCurrentId }}).sort({createdAt:1}).limit(4).lean();


	// console.log(categoryCurrentId)
	// console.log(categoryBanner)
	// console.log("=========")
	// console.log(product[0].productColor[0].colorId)

	let allBrand = [];

	for (var i = product.length - 1; i >= 0; i--) {
		allBrand.push(product[i].productBrand.toString())
	}
	// console.log(allBrand)
	return res.render('frontend/category' , {
		categoryMenu : categoryMenu , 
		categoryDropDown : categoryDropDown,
		category : category ,
		categoryCurrent : categoryCurrent,
		review : review,
		brand : brand ,
		product : product,
		categoryBanner : categoryBanner ,
		allBrand : allBrand 
	});

}

