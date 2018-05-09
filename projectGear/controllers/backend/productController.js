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
 const Product = require('../../models/Product');
 const Category = require('../../models/Category');
 const Brand = require('../../models/Brand');
 const Color = require('../../models/Color');
 const Gallery = require('../../models/Gallery');


// Method
/**
 * GET /
 * Admin/product/list.
 */

 exports.list = async (req, res) => {
 	let category = await Category.find({}).select({_id : 1, status :1, categoryName: 1}).lean();
 	let brand = await Brand.find({}).select({_id : 1 , status : 1 ,  brandName : 1 }).lean();
 	let color = await Color.find({}).select({_id : 1 , status : 1 ,  color : 1 }).lean();
 	let gallery = await  Gallery.find({}).select({_id : 1 , galleryName : 1 }).lean();

 	
 	
 	return res.render('backend/product/list', {
 		category : category ,
 		brand :  brand ,
 		color : color , 
 		gallery : gallery
 	});
 }

 exports.listProduct = async (req,res) =>{
 	let page = 1;
 	let limit = 20;
 	let totalPage = 1;
 	let query = {};
 	if (req.query.page) {
 		page = parseInt(req.query.page);
 	}

 	if(req.query.product_search_text && req.query.product_search_text !=""){
 		let regex = new RegExp(req.query.product_search_text.trim(), 'i')
 		query = {productName: {$regex : regex}}
 	} 

 	if (req.query.product_status && req.query.product_status !="") {
 		query['status'] = req.query.product_status;
 	}
 	if(req.query.product_brand && req.query.product_brand !=""){
 		query['productBrand'] = req.query.product_brand;
 	}
 	if(req.query.product_category && req.query.product_category !=""){
 		query['productCategory'] = req.query.product_category;
 	} 

 	let skip = (page - 1)*limit;

 	try{
 		let [count, data] = await Promise.all([
 			Product.count(query),
 			Product.find(query)
 			.populate('productCategory')
 			.populate('productBrand')
 			.populate('productColor')
 			.populate('productThumb')
 			.sort({numberPurchased : -1}).skip(skip).limit(limit)
 			])

 		let listProduct = [];

 		if (count && count >0) {
 			totalPage = Math.ceil(count/limit);
 		}

 		if (data && data.length) {
 			listProduct = data;
 		}
 		// console.log(listProduct[0])

 		res.send({status: true, page : page, totalPage : totalPage, listProduct : listProduct});



 	}catch(err){
 		res.send({status:false})
    // console.log("===============err=========================")
    console.log(err)
    // console.log("===============err=========================")
}
}

exports.getProductAdd = async (req,res) =>{
	let category = await Category.find({}).select({_id : 1, status :1, categoryName: 1}).lean();
	let brand = await Brand.find({}).select({_id : 1 , status : 1 ,  brandName : 1 }).lean();
	let color = await Color.find({}).select({_id : 1 , status : 1 ,  colorName : 1 }).lean();
	let gallery = await  Gallery.find({}).select({_id : 1 , galleryName : 1 }).lean();
	

	return res.render('backend/product/add', {
		category : category ,
		brand :  brand , 
		color : color ,
		gallery : gallery 
	});
}
exports.uploadImages = async(req,res) =>{
	upload (req,res,async function(err) {
		if(err) {
			console.log(err);
			return res.send({status:false, err : err});
		}
		

		try{
			// console.log(req.files)
			if (req.files) {
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


		catch(errors){
			console.log(errors);
			return res.send({status:false, errors : errors});
		}

	})
}
exports.listFileManager = async(req,res) =>{

	let page = 1;
	let limit = 16;
	let totalPage = 1;
	let query = {};
	if (req.query.page) {
		page = parseInt(req.query.page);
	}



	if(req.query.search_image && req.query.search_image !=""){
		let regex = new RegExp(req.query.search_image.trim(), 'i')
		query = {galleryName: {$regex : regex}}

	} 



	let skip = (page - 1)*limit;

	try{

		let [count, data] = await Promise.all([
			Gallery.count(query),
			Gallery.find(query)
			.sort({createdAt:1}).skip(skip).limit(limit).select({_id : 1 , galleryName : 1 }).lean()
			])

		let listFileManager = [];


		if (count && count >0) {
			totalPage = Math.ceil(count/limit);
			
		}

		if (data && data.length) {
			listFileManager = data;

		}
		// console.log(totalPage);
		// console.log(page);
		// console.log(listFileManager)

		res.send({status: true, page : page, totalPage : totalPage, listFileManager : listFileManager});
	}catch(err){
		res.send({status:false})
    // console.log("===============err=========================")
    console.log(err)
    // console.log("===============err=========================")
}

}
exports.postProductAddImageThumb = async (req,res) =>{
	if (req.body) {
		try{
			console.log(req.body.imageThumb)
			if(req.body.imageThumb == undefined){
				let errors = [{msg:"Vui lòng chọn ảnh"}];
				return res.send({status:false,errors:errors});
			}else {
				let data = req.body.imageThumb
				return res.send({status:true , data : data});
			}
		}
		catch(errors) {
			console.log(errors)
			return res.send({status:false, errors : errors});
		}
	}

}
exports.postProductRemoveImageThumb = async (req,res) =>{
	if (req.body.imageThumb) {
		try{
			let deleteGallery = await Gallery.remove({galleryName : req.body.imageThumb});
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


exports.postProductAdd = async (req,res) => {
	upload (req,res,async function(err) {
		if(err) {
			console.log(err);
			return res.send({status:false, err : err});
		}


		try{
			// req.files.forEach((f,i) => {
			// 	console.log(i, f)
			// })
			if (req.body) {
				console.log(req.body)
				
				if (req.body.productName && req.body.productName == "") {
					let errors = [{msg:"Tên sản phẩm không được để trống"}]
					return res.send({status:false, errors : errors});
				}else if (!req.files) {
					let errors = [{msg:"Vui lòng tải ảnh sản phẩm"}]
					return res.send({status:false, errors : errors});
				} else if (req.body.productCategory && req.body.productCategory == "" ) {
					let errors = [{msg:"Vui lòng chọn danh mục sản phẩm"}]
					return res.send({status:false, errors : errors});
				}else if (req.body.productBrand && req.body.productBrand == ""  ) {
					let errors = [{msg:"Vui lòng chọn nhãn hiệu sản phẩm"}]
					return res.send({status:false, errors : errors});
				}else if (req.body.productColor && req.body.productColor == ""  ) {
					let errors = [{msg:"Vui lòng chọn màu sản phẩm"}]
					return res.send({status:false, errors : errors});
				}else if (req.body.colorPrice && req.body.colorPrice == ""  ) {
					let errors = [{msg:"Giá sản phẩm không được để trống"}]
					return res.send({status:false, errors : errors});
				}else if (req.body.colorQuantity && req.body.colorQuantity == ""  ) {
					let errors = [{msg:"Số lượng sản phẩm không được để trống"}]
					return res.send({status:false, errors : errors});
				}else{
					let existingProduct = await Product.findOne({ productName : req.body.productName});

					if (existingProduct && existingProduct != "") {
						let errors = [{msg:"Tên sản phẩm đã tồn tại"}]
						return res.send({status:false, errors : errors});
					}
					console.log('dang o day')
					const product = new Product({
						productName : req.body.productName,
						productCategory : req.body.productCategory,
						productBrand : req.body.productBrand ,
						productColor : req.body.productColor,
						productPrice : req.body.productPrice,
						productPromotion : req.body.productPromotion,
						productQuantity : req.body.productQuantity ,
						description : req.body.description 
					});

					if (req.files) {
						product.productThumb = req.files.filename;
						product.productColor = req.files.filename;
					}

					let saveProduct = await product.save();
					if (!saveProduct) {
						let errors = [{msg:"Thêm sản phẩm thất bại"}]
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


exports.getProductEdit = async (req,res) =>{
	if (req.params && req.params.id) {
		try{
			let product = await Product.find({_id : req.params.id});
			let category = await Category.find({}).select({_id : 1, status :1, categoryName: 1}).lean();
			let brand = await Brand.find({}).select({_id : 1 , status : 1 ,  brandName : 1 }).lean();
			let color = await Color.find({}).select({_id : 1 , status : 1 ,  colorName : 1 }).lean();
			// console.log(product);
			res.render('backend/product/edit',{
				product:product[0],
				category : category ,
				brand : brand ,
				color : color,
				moment:moment
			})
		}catch(err){
		}
	}
}


exports.postProductEdit = async (req,res) => {
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
				if (req.body.productName == "") {
					let errors = [{msg:"Tên sản phẩm không được để trống"}]
					return res.send({status:false, errors : errors});
				} else if (req.body.price == "" ) {
					let errors = [{msg:"Giá sản phẩm không được để trống"}]
					return res.send({status:false, errors : errors});
				}else if (req.body.quantity == ""  ) {
					let errors = [{msg:"Số lượng sản phẩm không được để trống"}]
					return res.send({status:false, errors : errors});
				}else{
					let existingProduct = await Product.findOne({_id : {$ne: req.body.id}, productName: req.body.productName});

					if (existingProduct && existingProduct != "") {
						let errors = [{msg:"Tên sản phẩm đã tồn tại"}]
						return res.send({status:false, errors : errors});
					}
					

					const productDataUpdate = {
						productName : req.body.productName,
						productCategory : req.body.productCategory,
						productColor : req.body.productColor,
						price : req.body.price,
						quantity : req.body.quantity ,
						numberPurchased : req.body.numberPurchased,
						productBrand : req.body.productBrand ,
						description : req.body.description
					};

					if (req.file) {
						productDataUpdate.productThumb = req.file.filename;
						
					}

					// console.log(productDataUpdate)

					let updateProduct = await Product.update({ _id: req.body.id}, { $set: productDataUpdate});

					if (updateProduct) {
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



exports.deleteProduct = async (req,res) =>{
	if (req.body.id) {
		try{
			let deleteProduct = await Product.remove({_id : req.body.id});
			if (deleteProduct.result) {
				res.send({status:true});
			}else{
				res.send({status:false});
			}
		}catch(err){
			res.send({status:false})
		}
	}
}