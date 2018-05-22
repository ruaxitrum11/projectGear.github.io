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
 var mongoose = require('mongoose');
 var nodemailer =  require('nodemailer')


 const { check, validationResult } = require('express-validator/check');


// Models
const User = require('../../models/User');
const Product = require('../../models/Product');
const Category = require('../../models/Category');
const Bill = require('../../models/Bill');
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

 exports.validatorClient = [
 check('clientName', 'Họ và tên tối thiểu 5 ký tự').isLength({ min: 5 }),
 check('clientEmail', 'Email không hợp lệ').isEmail(),
 check('clientPhoneNumber', 'Vui lòng điền số điện thoại hợp lệ').isLength({ min: 9}),
 check('clientAddress', 'Vui lòng điền địa chỉ của bạn').isLength({ min: 1 })
 ]

 exports.addBill = async (req,res) => {
 	// console.log(req.body)
 	if (req.body) {
 		// console.log(req.body)
 		const errors = validationResult(req);
 		if (!errors.isEmpty()) {
 			return res.send({status:false, errors : errors.array()});
 		}

 		try {
 			// console.log(req.body)

 			var dataID = _.groupBy(req.body.productInfos, function (item) {
 				return item.productId
 			})
 			// console.log(dataID)

 			let arrID = [];

 			var items = Object.keys(dataID);

 			// console.log(items)

 			if (items.length) {
 				for (var i = items.length - 1; i >= 0; i--) {
 					if (items[i] && items !="") {
 						arrID.push(mongoose.Types.ObjectId(items[i]));
 					}
 				}
 			}
 			// console.log(arrID)
 			// console.log("=========")
 			let productBill = await Product.aggregate([
 				{$match: {_id : {$in : arrID}}},
 				{$unwind : "$productColor"},
 				{$project: {
 					productColor :1,
 					productThumb :1,
 					productName :1
 				}},
 				
 				])

 			var checkBillInvalid = [] 
 			var checkBillNotInvalid = [] 


 			for (var i = 0; i < productBill.length; i++) {
 				for (var j = 0; j < req.body.productInfos.length; j++) {
 					if(productBill[i]._id == req.body.productInfos[j].productId && productBill[i].productColor.colorId == req.body.productInfos[j].productColorId){
 						let productQuantity = productBill[i].productColor.colorQuantity
 						let billQuantity = req.body.productInfos[j].productQuantity
 						// let productNumberPurchased = productBill[i].productColor.colorNumberPurchased

 						// console.log("So luong product " + productQuantity)
 						// console.log("So luong product Bill " +billQuantity)
 						if(billQuantity<=productQuantity){
 							// console.log(productBill[i])
 							checkBillInvalid.push(req.body.productInfos[j])
 						}
 						else {
 							checkBillNotInvalid.push(req.body.productInfos[j])
 						}
 					}
 				}
 			}
 			// console.log(checkBillInvalid)	
 			// console.log("==============")
 			// console.log(checkBillNotInvalid)

 			if (checkBillInvalid && checkBillNotInvalid){
 				if(checkBillNotInvalid.length > 0) {
 					for (var i = 0; i < productBill.length; i++) {
 						for(var j = 0 ; j < checkBillNotInvalid.length ; j++) {
 							if(productBill[i]._id == checkBillNotInvalid[j].productId && productBill[i].productColor.colorId == checkBillNotInvalid[j].productColorId){
 								let errors = [{msg:'Sản phẩm '+productBill[i].productName+' chỉ còn lại '+productBill[i].productColor.colorQuantity+' chiếc . Quý khách vui lòng chọn lại số lượng sản phẩm !'}]
 								// console.log(errors)
 								return res.send({status:false,errors:errors})
 							}
 						}
 					}
 				}else{
 					const bill = new Bill({
 						productInfos : checkBillInvalid,
 						totalPrice : req.body.totalPrice , 
 						billPrice : req.body.billPrice , 
 						billPromotion : req.body.billPromotion,
 						clientName : req.body.clientName , 
 						clientEmail : req.body.clientEmail , 
 						clientPhoneNumber : req.body.clientPhoneNumber ,
 						clientAddress : req.body.clientAddress , 
 						clientDescription : req.body.clientDescription
 					});

 					let numberOfBill = await Bill.find({}).select({billNumber : 1}).sort({billNumber : -1});

 					if (numberOfBill.length == 0) {
 						bill.billNumber = 20180000;
 					}else{
 						bill.billNumber = numberOfBill[0].billNumber + 1 ;
 					}
 					let saveBill = await bill.save();
 					if (!saveBill) {
 						let errors = [{msg:"Tạo hóa đơn thất bại . Quý khách vui lòng thử lại"}]
 						return res.send({status:false, errors : errors});
 					}else {
 						// console.log(checkBillInvalid)
 						// console.log("==========")
 						// console.log(productBill)
 						for (var i = 0; i < productBill.length; i++) {
 							for (var j = 0; j < checkBillInvalid.length; j++) {
 								if(productBill[i]._id == checkBillInvalid[j].productId && productBill[i].productColor.colorId == checkBillInvalid[j].productColorId){
 									let productIdCurrent = productBill[i]._id
 									let productColorCurrent = productBill[i].productColor.colorId 

 									let billQuantityCurrent = checkBillInvalid[j].productQuantity

 									let productQuantityCurrent = parseInt(productBill[i].productColor.colorQuantity) - parseInt(billQuantityCurrent)
 									let productNumberPurchasedCurrent = parseInt(productBill[i].productColor.colorNumberPurchased) + parseInt(billQuantityCurrent)
 									
 									// console.log(productIdCurrent)
 									// console.log(productColorCurrent)
 									// console.log(productQuantityCurrent)
 									// console.log(productNumberPurchasedCurrent)
 									let updateProductQuantity = await Product
 									.update(
 										{ _id: productIdCurrent , 'productColor.colorId' : productColorCurrent},
 										{ $set: {
 											'productColor.$.colorNumberPurchased': productNumberPurchasedCurrent , 
 											'productColor.$.colorQuantity':productQuantityCurrent}
 										},
 										{multi: true}
 										);
 									// console.log(updateProductQuantity)
 								}
 							}
 						}
 						res.send({status:true});	
 					}

 					let transporter =  nodemailer.createTransport({ // config mail server
 						service: 'Gmail',
 						auth: {
 							user: 'ghostgaminggear@gmail.com',
 							pass: 'hieu5894'
 						}
 					});
 					// console.log(req.body.clientEmail)
 					// console.log(bill.billNumber)

 					var xhtml = '';

 					xhtml += '<p>Chào <span style="font-size:2rem;font-weight:bold">'+req.body.clientName+'</span> , </p>';
 					xhtml += '<p>Cảm ơn bạn đã sử dụng dịch vụ của Ghost Gaming Gear</p>';
 					xhtml += '<p>Mã đơn hàng : <span style="font-size:2rem;font-weight:bold">'+bill.billNumber+'</span> đã được chấp nhận</p>';
 					xhtml += '<p>Tổng đơn hàng : <span style="font-size:2rem;font-weight:bold">'+req.body.billPrice+'</span> VNĐ</p>';
 					xhtml += '<p>Khuyến mãi : <span style="font-size:2rem;font-weight:bold">'+req.body.billPromotion+'</span> %</p>';
 					xhtml += '<p>Tổng thanh toán : <span style="font-size:2rem;font-weight:bold">'+req.body.totalPrice+'</span> VNĐ</p>';
 					xhtml += '<p>Đơn hàng của bạn gồm : </p>';
 					xhtml += '<table class="table" style="width: 80%;text-align: center;">';
 					xhtml += '<thead>';
 					xhtml += '<tr>';
 					xhtml += '<th style="text-align: center;">Tên sản phẩm</th>';
 					xhtml += '<th style="text-align: center;">Màu sắc</th>';
 					xhtml += '<th style="text-align: center;">Số lượng </th>';
 					xhtml += '<th style="text-align: center;">Giá tiền</th>';
 					xhtml += '</tr>';
 					xhtml += '</thead>';
 					xhtml += '<tbody>';
 					for (var i = 0; i < checkBillInvalid.length; i++) {
 						xhtml += '<tr>';
 						xhtml += '<td style="text-transform:capitalize">'+checkBillInvalid[i].productName+'</td>';
 						xhtml += '<td><p style="height:20px ;background-color:'+checkBillInvalid[i].productColorCode+'"></p></td>';
 						xhtml += '<td>'+checkBillInvalid[i].productQuantity+'</td>';
 						xhtml += '<td>'+checkBillInvalid[i].productPrice+' đ</td>';
 						xhtml += '</tr>';
 					}
 					xhtml += '</tbody>';
 					xhtml += '</table>';
 					xhtml += '<p>Bạn sẽ nhận được sản phẩm trong khoảng thời gian 2 ngày.</p>';
 					xhtml += '<p>Mọi ý kiến thắc mắc , xin vui lòng liên hệ : </p>';
 					xhtml += '<ul>';
 					xhtml += '<li><span>Website</span> : ghostgaminggear.com.vn </li>';
 					xhtml += '<br>'
 					xhtml += '<li><span>Email</span> : ghostgaminggear@gmail.com</li>';
 					xhtml += '<br>'
 					xhtml += '<li><span>Facebook</span> : https://www.facebook.com/ghostgamingear</li>';
 					xhtml += '<br>'
 					xhtml += '<li><span>Youtube</span> : https://www.youtube.com/ghostgamingear</li>';
 					xhtml += '<br>'
 					xhtml += '<li><span>Twitter</span> : https://www.twitter.com/ghostgamingear</li>';
 					xhtml += '<br>'
 					xhtml += '<li><span>Twitch</span>: https://www.twitch.com/ghostgamingear</li>';
 					xhtml += '<br>'
 					xhtml += '<li><span>Instagram</span> : https://www.instagram.com/ghostgamingear</li>';
 					xhtml += '</ul>';

 					let mailList = ''+req.body.clientEmail+',ghostgaminggear@gmail.com';

 					let mainOptions = { // thiết lập đối tượng, nội dung gửi mail
 						from: 'Ghost Gaming Gear',
 						to: mailList,
 						subject: 'GhostGamingGear thông báo đơn hàng , mã hóa đơn : '+bill.billNumber ,
 						text: 'You recieved message from ' ,
 						html: xhtml
 					}

 					transporter.sendMail(mainOptions, function(err, info){
 						if (err) {
 							console.log(err);
 							// res.redirect('/');
 						} else {
 							console.log('Message sent: ' +  info.response);
 							// res.redirect('/');
 						}
 					});

 				}
 			}

 			
 		}catch(errors){
 			console.log(errors);
 			return res.send({status:false, errors : errors});
 		}
 	}
 }



