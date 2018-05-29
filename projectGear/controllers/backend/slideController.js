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
    	cb(null, './public/upload/slide')
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
}).single('fileSlide');

 // Models
 const Slide = require('../../models/Slide');


// Method
/**
 * GET /
 * Admin/product/list.
 */

 exports.list = async (req, res) => {
 	
 	return res.render('backend/slide/list');
 }

 exports.listSlide = async (req,res) =>{
 	let page = 1;
 	let limit = 20;
 	let totalPage = 1;
 	let query = {};
 	if (req.query.page) {
 		page = parseInt(req.query.page);
 	}

 	if (req.query.slide_status && req.query.slide_status !="") {
 		query['status'] = req.query.slide_status;
 	}

 	if (req.query.slide_isMain && req.query.slide_isMain !="") {
 		query['isSlideMain'] = req.query.slide_isMain;
 	}

 	
 	let skip = (page - 1)*limit;

 	try{
 		let [count, data] = await Promise.all([
 			Slide.count(query),
 			Slide.find(query)
 			.sort({createdAt : -1}).skip(skip).limit(limit)
 			])

 		let listSlide = [];

 		if (count && count >0) {
 			totalPage = Math.ceil(count/limit);
 		}

 		if (data && data.length) {
 			listSlide = data;
 		}

 		res.send({status: true, page : page, totalPage : totalPage, listSlide : listSlide});



 	}catch(err){
 		res.send({status:false})
    // console.log("===============err=========================")
    console.log(err)
    // console.log("===============err=========================")
}
}



exports.postSlideAdd = async (req,res) => {
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
				
				if (req.body.slideTitle == "") {
					let errors = [{msg:"Tiêu đề trang trình bày không được để trống"}]
					return res.send({status:false, errors : errors});
				} else if (req.body.isMain == 'undefined'){
					let errors = [{msg:"Loại trang trình bày không được để trống"}]
					return res.send({status:false, errors : errors});
				}else if (req.body.status == 'undefined'){
					let errors = [{msg:"Trạng thái trang trình bày không được để trống"}]
					return res.send({status:false, errors : errors});
				}else{

					const slide = new Slide({
						slideTitle : req.body.slideTitle,
						slideContent : req.body.slideContent,
						slideLink : req.body.slideLink,
						isSlideMain : req.body.isMain,
						status : req.body.status
					});

					if (req.file) {
						slide.slideImage = req.file.filename;
					}

					let saveSlide = await slide.save();
					if (!saveSlide) {
						let errors = [{msg:"Thêm màu thất bại"}]
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


exports.getSlideEdit = async (req,res) =>{
	if (req.params && req.params.id) {
		try{
			let slide = await Slide.find({_id : req.params.id});
			res.render('backend/slide/edit',{slide:slide[0],moment:moment})
		}catch(err){
		}
	}
}

exports.postSlideEdit = async (req,res) => {
	upload (req,res,async function(err) {
		if(err) {
			console.log(err);
			return res.send({status:false, err : err});
		}

		try{
			// console.log(req.body)
			if (req.body) {
				
				if (req.body.slideTitle == "") {
					let errors = [{msg:"Tiêu đề trang trình bày không được để trống"}]
					return res.send({status:false, errors : errors});
				} else if (req.body.isMain == 'undefined'){
					let errors = [{msg:"Loại trang trình bày không được để trống"}]
					return res.send({status:false, errors : errors});
				}else if (req.body.status == 'undefined'){
					let errors = [{msg:"Trạng thái trang trình bày không được để trống"}]
					return res.send({status:false, errors : errors});
				}else{

					const slideDataUpdate = {
						slideTitle : req.body.slideTitle,
						slideContent : req.body.slideContent,
						slideLink : req.body.slideLink,
						isSlideMain : req.body.isMain,
						status : req.body.status
					};

					if (req.file) {
						slideDataUpdate.slideImage = req.file.filename;
					}

					let updateSlide = await Slide.update({ _id: req.body.id}, { $set: slideDataUpdate});
					if (!updateSlide) {
						let errors = [{msg:"Thêm trang trình bày thất bại"}]
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



exports.deleteSlide = async (req,res) =>{
	if (req.body.id) {
		try{
			let deleteSlide = await Slide.remove({_id : req.body.id});
			if (deleteSlide.result) {
				res.send({status:true});
			}else{
				res.send({status:false});
			}
		}catch(err){
			res.send({status:false})
		}
	}
}