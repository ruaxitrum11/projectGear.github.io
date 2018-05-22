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
var nodemailer =  require('nodemailer')


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
			res.send({status:true});

			let billCurrent = await Bill.find({_id:req.body.id})

			if(billCurrent[0].status == 2 ) {

			  let transporter =  nodemailer.createTransport({ // config mail server
			  	service: 'Gmail',
			  	auth: {
			  		user: 'ghostgaminggear@gmail.com',
			  		pass: 'hieu5894'
			  	}
			  });


			  var xhtml = '';

			  xhtml += '<p>Chào <span style="font-size:2rem;font-weight:bold">'+billCurrent[0].clientName+'</span> , </p>';
			  xhtml += '<p>Cảm ơn bạn đã sử dụng dịch vụ của Ghost Gaming Gear</p>';

			  xhtml += '<p>Mã đơn hàng : <span style="font-size:2rem;font-weight:bold">'+billCurrent[0].billNumber+'</span> đã được xác nhận thành công</p>';
			  xhtml += '<p>Tổng thanh toán : <span style="font-size:2rem;font-weight:bold">'+billCurrent[0].totalPrice+'</span> VNĐ</p>';
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
			  for (var i = 0; i < billCurrent[0].productInfos.length; i++) {
			  	xhtml += '<tr>';
			  	xhtml += '<td style="text-transform:capitalize">'+billCurrent[0].productInfos[i].productName+'</td>';
			  	xhtml += '<td><p style="height:20px ;background-color:'+billCurrent[0].productInfos[i].productColorCode+'"></p></td>';
			  	xhtml += '<td>'+billCurrent[0].productInfos[i].productQuantity+'</td>';
			  	xhtml += '<td>'+billCurrent[0].productInfos[i].productPrice+' đ</td>';
			  	xhtml += '</tr>';
			  }
			  xhtml += '</tbody>';
			  xhtml += '</table>';
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

			  let mailList = ''+billCurrent[0].clientEmail+',ghostgaminggear@gmail.com';
			  // console.log(mailList)

          let mainOptions = { // thiết lập đối tượng, nội dung gửi mail
          	from: 'Ghost Gaming Gear',
          	to: mailList,
          	subject: 'GhostGamingGear thông báo đơn hàng , mã hóa đơn : '+billCurrent[0].billNumber+' đã được xác nhận thành công' ,
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

      }else if(billCurrent[0].status == 3 ) {

			  let transporter =  nodemailer.createTransport({ // config mail server
			  	service: 'Gmail',
			  	auth: {
			  		user: 'ghostgaminggear@gmail.com',
			  		pass: 'hieu5894'
			  	}
			  });


			  var xhtml = '';

			  xhtml += '<p>Chào <span style="font-size:2rem;font-weight:bold">'+billCurrent[0].clientName+'</span> , </p>';
			  xhtml += '<p>Cảm ơn bạn đã sử dụng dịch vụ của Ghost Gaming Gear</p>';

			  xhtml += '<p>Mã đơn hàng : <span style="font-size:2rem;font-weight:bold">'+billCurrent[0].billNumber+'</span> đã bị hủy bỏ</p>';
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

			  let mailList = ''+billCurrent[0].clientEmail+',ghostgaminggear@gmail.com';
			  console.log(mailList)

          let mainOptions = { // thiết lập đối tượng, nội dung gửi mail
          	from: 'Ghost Gaming Gear',
          	to: mailList,
          	subject: 'GhostGamingGear thông báo đơn hàng , mã hóa đơn : '+billCurrent[0].billNumber+' đã bị hủy bỏ' ,
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
}
catch(errors){
	console.log(errors);
	return res.send({status:false, errors : errors});
}
}



