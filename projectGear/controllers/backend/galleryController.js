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
    	cb(null, './public/upload/thumbProduct')
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
}).array("files", 100);

 // Models
 const Gallery = require('../../models/Gallery');
 const Product = require('../../models/Product');


// Method
/**
 * GET /
 * Admin/product/list.
 */

 exports.list = async (req, res) => {
 	return res.render('backend/gallery/list');
 }

 exports.listGallery = async (req,res) =>{
 	let page = 1;
 	let limit = 30;
 	let totalPage = 1;
 	let query = {};
 	if (req.query.page) {
 		page = parseInt(req.query.page);
 	}

 	if(req.query.gallery_search_text && req.query.gallery_search_text !=""){
 		let regex = new RegExp(req.query.gallery_search_text.trim(), 'i')
 		query = {galleryName: {$regex : regex}}
 	} 

 

 	let skip = (page - 1)*limit;

 	try{
 		let [count, data] = await Promise.all([
 			Gallery.count(query),
 			Gallery.find(query)
 			.sort({createdAt : -1}).skip(skip).limit(limit)
 			])

 		let listGallery = [];

 		if (count && count >0) {
 			totalPage = Math.ceil(count/limit);
 		}

 		if (data && data.length) {
 			listGallery = data;
 		}

 		res.send({status: true, page : page, totalPage : totalPage, listGallery : listGallery});



 	}catch(err){
 		res.send({status:false})
    // console.log("===============err=========================")
    console.log(err)
    // console.log("===============err=========================")
}
}



exports.addGallery = async (req,res) => {
	upload (req,res,async function(err) {
		if(err) {
			console.log(err);
			return res.send({status:false, err : err});
		}
		

		try{
			// console.log(req.files)
			if (req.files) {
			
				if(req.files == ""){
					let errors = [{msg: "Vui lòng chọn tệp cần tải"}]
					return res.send({status:false, errors : errors});
				} else {
					var saveGallery = await Promise.all(req.files.map(async file => {
						console.log(file.filename)
						await new Gallery({
							galleryName: file.filename
						}).save()
					}))
					if(!saveGallery) {
						let errors = [{msg:"Tải ảnh thất bại"}]
						return res.send({status:false, errors : errors});
					}
					else return res.send({status:true});
				}
			}
		}


		catch(errors){
			console.log(errors);
			return res.send({status:false, errors : errors});
		}

	})
}


// // exports.getCategoryEdit = async (req,res) =>{
// // 	if (req.params && req.params.id) {
// // 		try{
// // 			let category = await category.find({_id : req.params.id});
// // 			res.render('backend/category/edit',{category:category[0],moment:moment})
// // 		}catch(err){
// // 		}
// // 	}
// // }

// exports.postColorEdit = async (req,res) => {
// 	upload (req,res,async function(err) {
// 		if(err) {
// 			// console.log(err);
// 			return res.send({status:false, err : err});
// 		}
// 		// console.log(req.file)
// 		try{
// 			if (req.body) {
// 				// console.log(req.files)
// 				// console.log('=========================')
// 				// console.log(req.body)
// 				if (req.body.colorName == "") {
// 					let errors = [{msg:"Tên màu không được để trống"}]
// 					return res.send({status:false, errors : errors});
// 				}else if (req.body.colorCode == "") {
// 					let errors = [{msg:"Mã màu không được để trống"}]
// 					return res.send({status:false, errors : errors});
// 				}else if (req.body.status == undefined  ) {
// 					let errors = [{msg:"Vui lòng chọn trạng thái màu"}]
// 					return res.send({status:false, errors : errors});
// 				}else {
// 					let existingColorName = await Color.findOne({_id : {$ne: req.body.id}, colorName: req.body.colorName});
// 					let existingColorCode = await Color.findOne({_id : {$ne: req.body.id}, colorCode: req.body.colorCode});

// 					if (existingColorName && existingColorName != "") {
// 						let errors = [{msg:"Tên màu đã tồn tại"}]
// 						return res.send({status:false, errors : errors});
// 					}else if (existingColorCode && existingColorCode != "") {
// 						let errors = [{msg:"Mã màu đã tồn tại"}]
// 						return res.send({status:false, errors : errors});
// 					}

// 					const colorDataUpdate = {
// 						colorName : req.body.colorName,
// 						colorCode : req.body.colorCode,
// 						status : req.body.status
// 					};


// 					let updateColor = await Color.update({ _id: req.body.id}, { $set: colorDataUpdate});

// 					if (updateColor) {
// 						return res.send({status:true});
// 					}
// 				}
// 			}
// 		}

// 		catch(errors){
// 			// console.log(errors);
// 			return res.send({status:false, errors : errors});
// 		}

// 	})
// }



exports.deleteGallery = async (req,res) =>{
	if (req.body.id) {
		try{
			let deleteGallery = await Gallery.remove({_id : req.body.id});
			if (deleteGallery.result) {
				res.send({status:true});
			}else{
				res.send({status:false});
			}
		}catch(err){
			res.send({status:false})
		}
	}
}