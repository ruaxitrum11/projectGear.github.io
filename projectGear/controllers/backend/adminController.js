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


// Models
const User = require('../../models/User');
const Product = require('../../models/Product');
const Revenue = require('../../models/Revenue');
const Bill = require('../../models/Bill');
// Method
/**
 * GET /
 * Home page.
 */
 exports.admin = async (req, res) => {
  // let userAdmin = await User.find({status:1,role:1})
  // console.log("Index Frontend")
  
  return res.render('backend/admin' , {
    // userAdmin : userAdmin[0]
});
}

exports.revenue = async (req,res) => {
	// console.log(req.body)
	try {
		let revenue = await Revenue.find({createdAt:{$gte:req.body.timeBegin , $lte:req.body.timeEnd}}).lean()
		// console.log(revenue)
		return res.send({status:true,revenue:revenue,moment:moment})

	}catch(errors){
		return res.send({status:false,errors:errors})
	}
}

exports.countTotal = async (req,res) => {
	try {
		// console.log(req.query)
		// console.log(req.body)
		
		let countTotalBill = await Bill.count({status:1})

		totalMoneyBill = 0
		let moneyBill = await Bill.find({status:2})
		for (var i = 0; i < moneyBill.length; i++) {
			totalMoneyBill += moneyBill[i].totalPrice
		}
		// console.log(totalMoneyBill)

		if(totalMoneyBill > 999999 ) {
			var countTotalRevene = (totalMoneyBill/1000000).toFixed(1) + 'M'
		} else {
			var countTotalRevene = totalMoneyBill
		}
		// console.log(countTotalRevene)
		let countTotalUser = await User.count({})

		let product = await Product.aggregate([
			{$match: {}},
			{$unwind : "$productColor"},
			{$project: {
				productColor :1,
			}},

			])
		countTotalPurchased = 0;
		// console.log(product)
		for(var i = 0 ; i < product.length ; i++) {
			countTotalPurchased += product[i].productColor.colorNumberPurchased
		}
		// console.log(countTotalPurchased)
		
		let countProcessingBill = await Bill.count({status:1})

		let countCompletedBill = await Bill.count({status:2})

		let countCancelBill = await Bill.count({status:3})

		// console.log(countProcessingBill)
		// console.log(countCompletedBill)
		// console.log(countCancelBill)
	

		return res.send({status:true,
			countTotalBill:countTotalBill , 
			countTotalRevene:countTotalRevene , 
			countTotalUser:countTotalUser , 
			countTotalPurchased : countTotalPurchased,
			countProcessingBill : countProcessingBill ,
			countCompletedBill : countCompletedBill , 
			countCancelBill : countCancelBill,
		})
		

	}catch(errors){
		return res.send({status:false,errors:errors})
	}
}


