const cluster = require('cluster');
const request = require('request');
const _ = require('lodash');
const fs = require('fs');
const download = require('download');
const async = require('async');
const bcrypt = require('bcrypt-nodejs');
const multer = require('multer');
const path = require('path');
const moment = require('moment');
const Bill = require('../../models/Bill');
const Revenue = require('../../models/Revenue');

var CronJob = require('cron').CronJob;

/*======================== ANALYTICS BILL ===========*/
new CronJob("00 58 23 * * *", function() {
	setTimeout(sumTotalBill);
},null, true, 'Asia/Ho_Chi_Minh');

async function sumTotalBill(){
	let today = new Date(),
	year 	= today.getFullYear(),
	month 	= today.getMonth() + 1,
	day 	= today.getDate();
	if(month < 10){ month = '0'+month }
		if(day < 10){ day = '0'+day }

			let startDay = today.setHours(0,0,0,0);
		let endDay = today.setHours(23,59,59,999);

			// let startDay = new Date(${year}-${month}-${day} 00:00:00);
		// let endDay = new Date(${year}-${month}-${day} 23:59:59);

		let billTotal = await Bill.find({createdAt:{$gte:startDay , $lte:endDay}}).select({createdAt:1,totalPrice:1}).lean();

		let sumAllBill = 0;

		if (billTotal && billTotal.length) {

			for (var i = 0; i < billTotal.length; i++) {
				if(billTotal[i].createdAt){
					sumAllBill += billTotal[i].totalPrice;
				}
			}
		}

		let revenue = new Revenue({
			totalBill : sumAllBill
		})

		let saveRevenue = await revenue.save();

		if (saveRevenue) {
			console.log("CronJob success !")
		}else{
			console.log("CronJob fails !")
		}
	}


	const { check, validationResult } = require('express-validator/check');

//Setup multer upload
// let storage = multer.diskStorage({
//     // Configuring multer to upload folder
//     destination: function(req, file, cb) {
//     	cb(null, './public/upload/blog')
//     },
//     // Rename file to save in the database.
//     filename: function(req, file, cb) {
//     	var ext = file.originalname.split('.')
//     	cb(null, ext[0]+ '_' + Date.now() + '.' + ext[ext.length - 1]);
//     }
// });

// let upload = multer({ 
// 	storage: storage,
// 	fileFilter: function (req, file, cb) {
// 		var ext = file.originalname.split('.')
// 		var arrImg = ['jpg', 'jepg', 'png'];

// 		if (ext && ext[1]) {
// 			if (!arrImg.indexOf(ext[ext.length -1])<0) {
// 				return cb(new Error('Vui lòng upload tệp hình ảnh!'));
// 			}
// 		}

// 		// if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
// 		// 	return cb(new Error('Vui lòng upload ảnh!'));
// 		// }
// 		cb(null, true);
// 	}
// }).single('fileBlog');

 // Models




// Method
/**
 * GET /
 * Admin/product/list.
 */

 exports.list = async (req, res) => {
 	return res.render('backend/bill/list');
 }

 exports.listBill = async (req,res) =>{
 	let page = 1;
 	let limit = 20;
 	let totalPage = 1;
 	let query = {};
 	if (req.query.page) {
 		page = parseInt(req.query.page);
 	}

 	if(req.query.bill_text && req.query.bill_text !=""){
 		let regex = new RegExp(req.query.bill_text.trim(), 'i')
 		query = {clientEmail: {$regex : regex}}
 	} 
 	// console.log(req.query.bill_number)
 	if (req.query.bill_number && req.query.bill_number !="") {
 		query['billNumber'] = req.query.bill_number;
 	}

 	if (req.query.bill_status && req.query.bill_status !="") {
 		query['status'] = req.query.bill_status;
 	}

 	// console.log(query)

 	
 	let skip = (page - 1)*limit;

 	try{
 		let [count, data] = await Promise.all([
 			Bill.count(query),
 			Bill.find(query)
 			.sort({createdAt : -1 }).skip(skip).limit(limit)
 			])

 		let listBill = [];

 		if (count && count >0) {
 			totalPage = Math.ceil(count/limit);
 		}

 		if (data && data.length) {
 			listBill = data;
 		}

 		res.send({status: true, page : page, totalPage : totalPage, listBill : listBill});



 	}catch(err){
 		res.send({status:false})
    // console.log("===============err=========================")
    console.log(err)
    // console.log("===============err=========================")
}
}
exports.getBillInfo = async (req,res) => {
	if (req.params && req.params.id) {
		try{
			let billInfo = await Bill.find({_id : req.params.id}).populate('productInfos.productColorId');
			// console.log(billInfo)
			res.render('backend/bill/info',{billInfo:billInfo[0],moment:moment})
		}catch(err){
		}
	}
}


exports.postBillEdit = async (req,res) => {
	try{
		if (req.body) {

			const billDataUpdate = {
				status : req.body.status
			};

			let updateBill = await Bill.update({ _id: req.body.id}, { $set: billDataUpdate});
			if (!updateBill) {
				let errors = [{msg:"Cập nhật trạng thái hóa đơn thất bại"}]
				return res.send({status:false, errors : errors});
			}
			return res.send({status:true});

		}
	}
	catch(errors){
		console.log(errors);
		return res.send({status:false, errors : errors});
	}
}



