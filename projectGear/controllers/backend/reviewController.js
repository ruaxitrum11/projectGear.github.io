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



const { check, validationResult } = require('express-validator/check');

//Setup multer upload
let storage = multer.diskStorage({
    // Configuring multer to upload folder
    destination: function(req, file, cb) {
    	cb(null, './public/upload/avatar')
    },
    // Rename file to save in the database.
    filename: function(req, file, cb) {
    	var ext = file.originalname.split('.')
    	cb(null, ext[0]+ '_' + Date.now() + '.' + ext[ext.length - 1]);
    }
});

let upload = multer({ 
	storage: storage,
	fileFilter: function (req, file, cb) {
		var ext = file.originalname.split('.')
		var arrImg = ['jpg', 'jepg', 'png'];

		if (ext && ext[1]) {
			if (!arrImg.indexOf(ext[ext.length -1])<0) {
				return cb(new Error('Vui lòng upload tệp hình ảnh!'));
			}
		}

		// if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
		// 	return cb(new Error('Vui lòng upload ảnh!'));
		// }
		cb(null, true);
	}
}).single('fileReview');

 // Models
 const Review = require('../../models/Review');


// Method
/**
 * GET /
 * Admin/product/list.
 */

 exports.list = async (req, res) => {
 	return res.render('backend/review/list');
 }

 exports.listReview = async (req,res) =>{
 	let page = 1;
 	let limit = 20;
 	let totalPage = 1;
 	let query = {};
 	if (req.query.page) {
 		page = parseInt(req.query.page);
 	}

 	if(req.query.blog_author && req.query.blog_author !=""){
 		let regex = new RegExp(req.query.blog_author.trim(), 'i')
 		query = {reviewName: {$regex : regex}}
 	} 

 	if (req.query.blog_status && req.query.blog_status !="") {
 		query['status'] = req.query.blog_status;
 	}


 	
 	let skip = (page - 1)*limit;

 	try{
 		let [count, data] = await Promise.all([
 			Review.count(query),
 			Review.find(query)
 			.sort({createdAt : -1 }).skip(skip).limit(limit)
 			])

 		let listReview = [];

 		if (count && count >0) {
 			totalPage = Math.ceil(count/limit);
 		}

 		if (data && data.length) {
 			listReview = data;
 		}

 		res.send({status: true, page : page, totalPage : totalPage, listReview : listReview});



 	}catch(err){
 		res.send({status:false})
    // console.log("===============err=========================")
    console.log(err)
    // console.log("===============err=========================")
}
}

exports.getReviewAdd = async (req,res) => {
	res.render('backend/review/add');
}

exports.postReviewAdd = async (req,res) => {
	upload (req,res,async function(err) {
		if(err) {
			console.log(err);
			return res.send({status:false, err : err});
		}
		
		if(!req.file){
			let errors = [{msg:"Vui lòng tải ảnh lên"}]
			return res.send({status:false, errors : errors});
		}

		try{
			// console.log(req.body)
			if (req.body) {
				
				if (req.body.reviewName == "") {
					let errors = [{msg:"Người đánh giá không được để trống"}]
					return res.send({status:false, errors : errors});
				} else if (req.body.reviewDescription == ""){
					let errors = [{msg:"Mô tả đánh giá không được để trống"}]
					return res.send({status:false, errors : errors});
				}else if (req.body.reviewContent == ""){
					let errors = [{msg:"Nội dung đánh giá không được để trống"}]
					return res.send({status:false, errors : errors});
				}else{

					const review = new Review({
						reviewName : req.body.reviewName,
						reviewDescription : req.body.reviewDescription,
						reviewContent : req.body.reviewContent,
					});

					if (req.file) {
						review.reviewImage = req.file.filename;
					}

					let saveReview = await review.save();
					if (!saveReview) {
						let errors = [{msg:"Thêm đánh giá thất bại"}]
						return res.send({status:false, errors : errors});
					}
					return res.send({status:true});

				}
			}
		}

		catch(errors){
			console.log(errors);
			return res.send({status:false, errors : errors});
		}

	})
}


exports.getReviewEdit = async (req,res) =>{
	if (req.params && req.params.id) {
		try{
			let review = await Review.find({_id : req.params.id});
			let countReview = await Review.find({status:1}).count();
			// console.log(countReview)
			res.render('backend/review/edit',{
				review:review[0],
				countReview : countReview ,
				moment:moment
				})
		}catch(err){
		}
	}
}

exports.postReviewEdit = async (req,res) => {
	upload (req,res,async function(err) {
		if(err) {
			console.log(err);
			return res.send({status:false, err : err});
		}

		try{
			// console.log(req.body)
			if (req.body) {

				if (req.body.reviewName == "") {
					let errors = [{msg:"Người đánh giá không được để trống"}]
					return res.send({status:false, errors : errors});
				} else if (req.body.reviewDescription == ""){
					let errors = [{msg:"Mô tả đánh giá không được để trống"}]
					return res.send({status:false, errors : errors});
				}else if (req.body.reviewContent == ""){
					let errors = [{msg:"Nội dung đánh giá không được để trống"}]
					return res.send({status:false, errors : errors});	
				}else{
					let countReview = await Review.find({status:1}).count()

					if(req.body.status == 1 && countReview > 9 ){
						let errors = [{msg:"Chỉ cho phép tối đa 9 đánh giá Active"}]
						return res.send({status:false,errors:errors})
					}

					const reviewDataUpdate = {
						reviewName : req.body.reviewName,
						reviewDescription : req.body.reviewDescription,
						reviewContent : req.body.reviewContent,
						status : req.body.status
					};

					if (req.file) {
						reviewDataUpdate.reviewImage = req.file.filename;
					}

					let updateReview = await Review.update({ _id: req.body.id}, { $set: reviewDataUpdate});
					if (!updateReview) {
						let errors = [{msg:"Sửa đánh giá thất bại"}]
						return res.send({status:false, errors : errors});
					}
					return res.send({status:true});

				}
			}
		}
		catch(errors){
			console.log(errors);
			return res.send({status:false, errors : errors});
		}

	})
}



exports.deleteReview = async (req,res) =>{
	if (req.body.id) {
		try{
			let deleteReview = await Review.remove({_id : req.body.id});
			if (deleteReview.result) {
				res.send({status:true});
			}else{
				res.send({status:false});
			}
		}catch(err){
			res.send({status:false})
		}
	}
}