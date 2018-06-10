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
 const json2xls = require('json2xls');
 const path = require('path');
 const mime = require('mime');




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
  	moment : moment
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

exports.creatExcelFile = async (req,res) => {
	// console.log(req.query)
	try {
		let revenue = await Revenue.find({createdAt:{$gte:req.query.timeBegin , $lte:req.query.timeEnd}})
		.select({createdAt:1,totalBill:1}).sort({createdAt:1}).lean()
		// console.log(revenue)
		// console.log('here')
		
		for(var i = 0; i < revenue.length; i++){
			revenue[i].Thoi_gian = moment(revenue[i]['createdAt']).format('DD-MM-YYYY');
			revenue[i].Tong_tien = revenue[i]['totalBill'];
			delete revenue[i]._id;
			delete revenue[i].createdAt;
			delete revenue[i].totalBill;
		}	

		// revenue = JSON.stringify([obj]);
		// console.log(revenue)

		let xls = json2xls(revenue);
		// console.log(xls)
		let ext = Date.now()
		fs.writeFileSync('public/excelRevenue/doanhthu.xlsx',xls,'binary')
		res.download('public/excelRevenue/doanhthu.xlsx', 'doanhthu.xlsx', function(err){
			if (err) {
				// console.log(revenue)
				console.log(err)
			} else {
				console.log('saved')
			}
		});

		// res.setHeader('Content-disposition', 'attachment; filename=doanhthu_'+Date.now()+'.xlsx');
		// res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
		// return res.sendFile('Downloads/doanhthu_'+Date.now()+'.xlsx');

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

		let countWaiting = await Bill.count({status:4})

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
			countWaiting : countWaiting
		})
		

	}catch(errors){
		return res.send({status:false,errors:errors})
	}
}


