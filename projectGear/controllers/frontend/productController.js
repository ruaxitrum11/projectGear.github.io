/***********************
 * Module dependencies.
 **********************/
 const cluster = require('cluster');
 const request = require('request');
 const _ = require('lodash');
 const fs = require('fs');
 const download = require('download');
 const async = require('async');
 var mongoose = require('mongoose');

// Models
const User = require('../../models/User');
const Product = require('../../models/Product');
const Category = require('../../models/Category');
const Brand = require('../../models/Brand');
const Specifications = require('../../models/Specifications')
// Method
/**
 * GET Category /
 * Laptop.
 */
 exports.product = async (req, res) => {
 	// let categoryMenu = await Category.find({isCategoryMenu : 1 , status : 1}).sort({createdAt:1}).limit(4).lean();
 	let categoryMenu = await Category.find({isCategoryMenu : 1 , status : 1}).sort({createdAt:1}).limit(4).lean();
 	let categoryDropDown = await Category.find({isCategoryMenu : 0 , status : 1} ).sort({createdAt:1}).lean();
 	let category = await Category.find({status:1}).sort({createdAt:1}).lean();
 	
 	// console.log(req.params)
 	let product = await Product.find({_id : req.params.id})
 	.populate('productColor.colorId')
 	.populate('productSpecifications.productSpecificationsId');
 	// console.log(product[0].productCategory)

 	let categoryCurrent = product[0].productCategory;
 	// console.log(categoryCurrent)

 	let productCategoryCurrent = await Product.find({productCategory : categoryCurrent , status : 1 })
 	.sort({createdAt:-1}).limit(3).lean()
 	
 	// console.log(productCategoryCurrent)

 	return res.render('frontend/product' , {
 		categoryMenu : categoryMenu ,
 		categoryDropDown : categoryDropDown , 
 		category : category ,
 		product : product[0],
 		productCategoryCurrent : productCategoryCurrent
 	});

 }

 exports.showProduct = async(req,res) => {

	// console.log(req.body.idColor)


	let productColorFindId = await Product
	.find({ _id : req.body.idProduct})
	.select({productColor : 1 })
	
	
	for (var i = 0; i < productColorFindId[0].productColor.length; i++) {
		// console.log(productColorFindId[i])
		if(productColorFindId[0].productColor[i].colorId == req.body.idColor ){
			var dataProductColor = productColorFindId[0].productColor[i]
		}
	}
	// console.log(dataProductColor) 

	return res.send({status:true , dataProductColor : dataProductColor})

	
}
exports.changeColor = async(req,res) =>{
	// console.log(req.body)
	let productCurrent = await Product.find({_id : req.body.idProduct})
	.select({productColor:1, _id:1})
	// console.log(productCurrent[0].productColor)
	// console.log(productCurrent)
	for ( var i = 0 ; i < productCurrent[0].productColor.length ; i++){
		if (productCurrent[0].productColor[i].colorId == req.body.idColor) {
			var dataProductColorCategory = productCurrent[0].productColor[i]
		}
	}
	// console.log(dataProductColorCategory)
	return res.send({status:true,dataProductColorCategory : dataProductColorCategory , productCurrent : productCurrent[0]})
}


	// return res.send({status:true , productColorCode : productColorCode[0]})

	exports.addToCart = async(req,res) => {


	// console.log(req.body.postData)

	let arrID = [];

	var items = Object.keys(req.body.postData);

	// console.log(items)

	if (items.length) {
		for (var i = items.length - 1; i >= 0; i--) {
			if (items[i] && items !="") {
				arrID.push(mongoose.Types.ObjectId(items[i]));
			}
		}
	}

	// console.log(items)

	// console.log(req.body.postData)

	// let product = await Product.find({_id : {$in : items }}).select({productColor:1 , productThumb : 1 , productName :1})

	let productCart = await Product.aggregate([
		{$match: {_id : {$in : arrID}}},
		{$unwind : "$productColor"},
		{$project: {
			productColor :1,
			productThumb :1,
			productName :1
		}},
		{$lookup : {
			from : "colors",
			localField : "productColor.colorId",
			foreignField : "_id",
			as : "productColor.idColorLookup"
		}}
		])
	
	// console.log(product[0].productColor.idColorLookup[0])
	return res.send({status:true , productCart : productCart } )


	
}