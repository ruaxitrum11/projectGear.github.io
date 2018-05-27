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
}).single('fileImage');

 // Models
 const Brand = require('../../models/Brand');
 const Product = require('../../models/Product');


// Method
/**
 * GET /
 * Admin/product/list.
 */

 exports.list = async (req, res) => {
 	let product = await Product.find({}).select({}).lean();
 	return res.render('backend/brand/list',{product:product});
 }

 exports.listBrand = async (req,res) =>{
 	let page = 1;
 	let limit = 20;
 	let totalPage = 1;
 	let query = {};
 	if (req.query.page) {
 		page = parseInt(req.query.page);
 	}
 	if(req.query.brand_search_text && req.query.brand_search_text !=""){
 		let regex = new RegExp(req.query.brand_search_text.trim(), 'i')
 		query = {brandName: {$regex : regex}}
 	} 

 	if (req.query.brand_status && req.query.brand_status !="") {
 		query['status'] = req.query.brand_status;
 	}
 

 	let skip = (page - 1)*limit;

 	try{
 		let [count, data] = await Promise.all([
 			Brand.count(query),
 			Brand.find(query)
 			.sort({createdAt : -1}).skip(skip).limit(limit)
 			])

 		let listBrand = [];

 		if (count && count >0) {
 			totalPage = Math.ceil(count/limit);
 		}

 		if (data && data.length) {
 			listBrand = data;
 		}

 		res.send({status: true, page : page, totalPage : totalPage, listBrand : listBrand});



 	}catch(err){
 		res.send({status:false})
    // console.log("===============err=========================")
    console.log(err)
    // console.log("===============err=========================")
}
}



exports.postBrandAdd = async (req,res) => {
	upload (req,res,async function(err) {
		if(err) {
			console.log(err);
			return res.send({status:false, err : err});
		}
		

		try{
			if (req.body) {
				
				if (req.body.brandName == "") {
					let errors = [{msg:"Tên nhãn hiệu không được để trống"}]
					return res.send({status:false, errors : errors});
				} else{
					let existingBrand = await Brand.findOne({ brandName : req.body.brandName});

					if (existingBrand && existingBrand != "") {
						let errors = [{msg:"Tên nhãn hiệu đã tồn tại"}]
						return res.send({status:false, errors : errors});
					}

					const brand = new Brand({
						brandName : req.body.brandName
					});

					let saveBrand = await brand.save();
					if (!saveBrand) {
						let errors = [{msg:"Thêm nhãn hiệu sản phẩm thất bại"}]
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


// exports.getCategoryEdit = async (req,res) =>{
// 	if (req.params && req.params.id) {
// 		try{
// 			let category = await category.find({_id : req.params.id});
// 			res.render('backend/category/edit',{category:category[0],moment:moment})
// 		}catch(err){
// 		}
// 	}
// }

exports.postBrandEdit = async (req,res) => {
	upload (req,res,async function(err) {
		if(err) {
			// console.log(err);
			return res.send({status:false, err : err});
		}
		// console.log(req.file)
		try{
			if (req.body) {
				// console.log(req.files)
				// console.log('=========================')
				console.log(req.body)
				if (req.body.brandName == "") {
					let errors = [{msg:"Tên nhãn hiệu không được để trống"}]
					return res.send({status:false, errors : errors});
				}else if (req.body.status == undefined  ) {
					let errors = [{msg:"Vui lòng chọn trạng thái nhãn hiệu"}]
					return res.send({status:false, errors : errors});
				}else {
					let existingBrand = await Brand.findOne({_id : {$ne: req.body.id}, brandName: req.body.brandName});

					if (existingBrand && existingBrand != "") {
						let errors = [{msg:"Tên nhãn hiệu đã tồn tại"}]
						return res.send({status:false, errors : errors});
					}


					const brandDataUpdate = {
						brandName : req.body.brandName,
						status : req.body.status
					};
					console.log(brandDataUpdate)

					let updateBrand = await Brand.update({ _id: req.body.id}, { $set: brandDataUpdate});

					if (updateBrand) {
						return res.send({status:true});
					}
				}
			}
		}

		catch(errors){
			// console.log(errors);
			return res.send({status:false, errors : errors});
		}

	})
}



exports.deleteBrand = async (req,res) =>{
	if (req.body.id) {
		try{
			let deleteBrand = await Brand.remove({_id : req.body.id});
			if (deleteBrand.result) {
				res.send({status:true});
			}else{
				res.send({status:false});
			}
		}catch(err){
			res.send({status:false})
		}
	}
}