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


 // Models
 const Specifications = require('../../models/Specifications');
 const Product = require('../../models/Product');


// Method
/**
 * GET /
 * Admin/product/list.
 */

 exports.list = async (req, res) => {
 	let product = await Product.find({}).select({}).lean();
 	return res.render('backend/specifications/list');
 }

 exports.listSpecifications = async (req,res) =>{
 	let page = 1;
 	let limit = 20;
 	let totalPage = 1;
 	let query = {};
 	if (req.query.page) {
 		page = parseInt(req.query.page);
 	}

 	if(req.query.color_search_text && req.query.color_search_text !=""){
 		let regex = new RegExp(req.query.color_search_text.trim(), 'i')
 		query = {$or: [{colorName: {$regex : regex}},{colorCode :{$regex:regex}}]}
 	} 

 	if (req.query.color_status && req.query.color_status !="") {
 		query['status'] = req.query.color_status;
 	}


 	let skip = (page - 1)*limit;

 	try{
 		let [count, data] = await Promise.all([
 			Specifications.count(query),
 			Specifications.find(query)
 			.sort({createdAt : -1}).skip(skip).limit(limit)
 			])

 		let listSpecifications = [];

 		if (count && count >0) {
 			totalPage = Math.ceil(count/limit);
 		}

 		if (data && data.length) {
 			listSpecifications = data;
 		}

 		// console.log(listSpecifications)

 		res.send({status: true, page : page, totalPage : totalPage, listSpecifications : listSpecifications});





 	}catch(err){
 		res.send({status:false})
    // console.log("===============err=========================")
    console.log(err)
    // console.log("===============err=========================")
}
}



exports.postSpecificationsAdd = async (req,res) => {
	

	try{
		console.log(req.body)
		if (req.body) {
			// console.log(req.body)
			if (req.body.specificationsName == "") {
				let errors = [{msg:"Tên thông số không được để trống"}]
				return res.send({status:false, errors : errors});
			}else{
				let existingspecificationsName = await Specifications.findOne({ specificationsName : req.body.specificationsName});
				if (existingspecificationsName && existingspecificationsName != "") {
					let errors = [{msg:"Tên thông số đã tồn tại"}]
					return res.send({status:false, errors : errors});
				}

				const specifications = new Specifications({
					specificationsName : req.body.specificationsName,
				});

				let specificationsSave = await specifications.save();
				if (!specificationsSave) {
					let errors = [{msg:"Thêm thông số thất bại"}]
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



// // exports.getCategoryEdit = async (req,res) =>{
// // 	if (req.params && req.params.id) {
// // 		try{
// // 			let category = await category.find({_id : req.params.id});
// // 			res.render('backend/category/edit',{category:category[0],moment:moment})
// // 		}catch(err){
// // 		}
// // 	}
// // }



exports.postSpecificationsEdit = async (req,res) => {
	try{
		if (req.body) {
				// console.log(req.files)
				// console.log('=========================')
				// console.log(req.body)
				if (req.body.specificationsName == "") {
					let errors = [{msg:"Tên thông số không được để trống"}]
					return res.send({status:false, errors : errors});
				}else if (req.body.status == undefined  ) {
					let errors = [{msg:"Vui lòng chọn trạng thái thông số"}]
					return res.send({status:false, errors : errors});
				}else {
					let existingSpecificationsName = await Specifications.findOne({_id : {$ne: req.body.id}, colorName: req.body.specificationsName});

					if (existingSpecificationsName && existingSpecificationsName != "") {
						let errors = [{msg:"Tên thông số đã tồn tại"}]
						return res.send({status:false, errors : errors});
					}
					// console.log(req.body.specificationsName)
					const specificationsDataUpdate = {
						specificationsName : req.body.specificationsName,
						status : req.body.status
					};
					// console.log(specificationsDataUpdate)
					

					let updateSpecifications = await Specifications.update({ _id: req.body.id}, { $set: specificationsDataUpdate});

					if (updateSpecifications) {
						return res.send({status:true});
					}
				}
			}
		}

		catch(errors){
			// console.log(errors);
			return res.send({status:false, errors : errors});
		}

	}



	exports.deleteSpecifications = async (req,res) =>{
		if (req.body.id) {
			try{
				let deleteSpecifications = await Specifications.remove({_id : req.body.id});
				if (deleteSpecifications.result) {
					res.send({status:true});
				}else{
					res.send({status:false});
				}
			}catch(err){
				res.send({status:false})
			}
		}
	}