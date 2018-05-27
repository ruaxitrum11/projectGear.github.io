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
}).single('file');

 // Models
 const Category = require('../../models/Category');
 const Product = require('../../models/Product');


// Method
/**
 * GET /
 * Admin/product/list.
 */

 exports.list = async(req, res) => {
 	let countCategoryMenu = await Category.find({isCategoryMenu : 1}).count();
 	return res.render('backend/category/list',{countCategoryMenu:countCategoryMenu});
 }

 exports.listCategory = async (req,res) =>{
 	let page = 1;
 	let limit = 20;
 	let totalPage = 1;
 	let query = {};
 	if (req.query.page) {
 		page = parseInt(req.query.page);
 	}

 	if(req.query.category_search_text && req.query.category_search_text !=""){
 		let regex = new RegExp(req.query.category_search_text.trim(), 'i')
 		query = {categoryName: {$regex : regex}}
 	} 

 	if (req.query.category_status && req.query.category_status !="") {
 		query['status'] = req.query.category_status;
 	}

 	if (req.query.category_species && req.query.category_species !="") {
 		query['isCategoryMenu'] = req.query.category_species;
 	}


 	let skip = (page - 1)*limit;

 	try{
 		let [count, data] = await Promise.all([
 			Category.count(query),
 			Category.find(query)
 			.sort({createdAt : -1}).skip(skip).limit(limit)
 			])

 		let listCategory = [];

 		if (count && count >0) {
 			totalPage = Math.ceil(count/limit);
 		}

 		if (data && data.length) {
 			listCategory = data;
 		}


 		res.send({status: true, page : page, totalPage : totalPage, listCategory : listCategory });



 	}catch(err){
 		res.send({status:false})
    // console.log("===============err=========================")
    console.log(err)
    // console.log("===============err=========================")
}
}



exports.postCategoryAdd = async (req,res) => {
		try{
			if (req.body) {
				
				if (req.body.categoryName == "") {
					let errors = [{msg:"Tên danh mục không được để trống"}]
					return res.send({status:false, errors : errors});
				}else if (req.body.categoryNameSummary == ""){
					let errors = [{msg:"Tên rút gọn không được để trống"}]
					return res.send({status:false , errors : errors});
				}else{
					let existingCategory = await Category.findOne({ categoryName : req.body.categoryName});

					if (existingCategory && existingCategory != "") {
						let errors = [{msg:"Tên danh mục đã tồn tại"}]
						return res.send({status:false, errors : errors});
					}

					let existingCategory2 = await Category.findOne({_id : {$ne: req.body.id}, categoryNameSummary: req.body.categoryNameSummary});

					if (existingCategory2 && existingCategory2 != "") {
						let errors = [{msg:"Tên rút gọn đã tồn tại"}]
						return res.send({status:false, errors : errors});
					}

					const category = new Category({
						categoryName : req.body.categoryName ,
						categoryNameSummary : req.body.categoryNameSummary,
						isCategoryMenu : req.body.isCategoryMenu
					});

					// console.log(category)

					let saveCategory = await category.save();
					if (!saveCategory) {
						let errors = [{msg:"Thêm danh mục sản phẩm thất bại"}]
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

}


exports.getCategoryEdit = async (req,res) =>{
	if (req.params && req.params.id) {
		try{
			let category = await Category.find({_id : req.params.id});
			let countCategoryMenu = await Category.find({isCategoryMenu : 1}).count();
			res.render('backend/category/edit',{
				category:category[0],moment:moment , 
				countCategoryMenu : countCategoryMenu
			} )

		}catch(err){
		}
	}
}

exports.postCategoryEdit = async (req,res) => {
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
				// console.log(req.body)
				if (req.body.categoryName == "") {
					let errors = [{msg:"Tên danh mục không được để trống"}]
					return res.send({status:false, errors : errors});
				}else if (req.body.categoryNameSummary == ""){
					let errors = [{msg:"Tên rút gọn không được để trống"}]
					return res.send({status:false , errors : errors});
				}else {
					let existingCategory = await Category.findOne({_id : {$ne: req.body.id}, categoryName: req.body.categoryName});
					

					if (existingCategory && existingCategory != "") {
						let errors = [{msg:"Tên danh mục đã tồn tại"}]
						return res.send({status:false, errors : errors});
					}

					let existingCategory2 = await Category.findOne({_id : {$ne: req.body.id}, categoryNameSummary: req.body.categoryNameSummary});

					if (existingCategory2 && existingCategory2 != "") {
						let errors = [{msg:"Tên rút gọn đã tồn tại"}]
						return res.send({status:false, errors : errors});
					}

					const categoryDataUpdate = {
						categoryName : req.body.categoryName,
						isCategoryMenu : req.body.isCategoryMenu,
						categoryNameSummary : req.body.categoryNameSummary ,
						status : req.body.status
					};
					

					let updateCategory = await Category.update({ _id: req.body.id}, { $set: categoryDataUpdate});

					if (updateCategory) {
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



exports.deleteCategory = async (req,res) =>{
	if (req.body.id) {
		try{
			let deleteCategory = await Category.remove({_id : req.body.id});
			if (deleteCategory.result) {
				res.send({status:true});
			}else{
				res.send({status:false});
			}
		}catch(err){
			res.send({status:false})
		}
	}
}

exports.uploadCategoryBanner = (req,res) =>{
  // console.log(req)
  upload(req,res,function(err) {
    // console.log(req)
    if(err) {
      console.log(err);
      return res.send({status:false, msg:'Chỉ cho phép tải ảnh lên !'});
    }
    // console.log("upload done")

    if(req.body.id && req.body.id != ''){
      if (req.file) {
        Category.update({_id : req.body.id}, {categoryBanner: req.file.filename}, (err,results)=>{
          if(err){
            return res.send({status:false, msg:'Tải ảnh thất bại'});
          }
          return res.send({status:true, msg:'Tải ảnh thành công !'});
        })
      }else{
        return res.send({status:false, msg:'Không tìm thấy ảnh !'});
      }
    }else{
      return res.send({status:false, msg:'Không tìm thấy ảnh !'});
    }
  })
}