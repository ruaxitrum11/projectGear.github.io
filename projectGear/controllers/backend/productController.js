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
 const Specifications = require('../../models/Specifications');


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
 			.populate('productColor.colorId')
 			.sort({numberPurchased : -1}).skip(skip).limit(limit)
 			])

 		let listProduct = [];
 		// console.log(data[0].productColor)
 		if (count && count >0) {
 			totalPage = Math.ceil(count/limit);
 		}

 		if (data && data.length) {
 			listProduct = data;
 		}

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
	let specifications = await  Specifications.find({}).select({_id : 1 , specificationsName : 1 }).lean();


	return res.render('backend/product/add', {
		category : category ,
		brand :  brand , 
		color : color ,
		gallery : gallery ,
		specifications : specifications,

	});
}

// exports.showUpload = async (req,res) =>{
// 	if (req.body) {
// 		try{
// 			const colorId = new Product({
// 				productColor : req.body.productName,

// 			});

// 			let saveProduct = await product.save();
// 			if (!saveProduct) {
// 				let errors = [{msg:"Thêm sản phẩm thất bại"}]
// 				return res.send({status:false, errors : errors});
// 			}
// 			return res.send({status:true});
// 		}catch(err){
// 			res.send({status:false})
// 		}
// 	}
// }
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
					// console.log(file.filename)
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
	// console.log(req.cookies)

	let page = 1;
	let limit = 16;
	let totalPage = 1;
	let query = {};
	// console.log(req.query)
	// console.log(req.query.id)
	if (req.query) {
		page = parseInt(req.query.page);
		if (req.query.id) {
			id = req.query.id;
		}else{
			id = req.cookies.currentColorId;
		}
	}


	if(req.query.search_image && req.query.search_image !=""){
		let regex = new RegExp(req.query.search_image.trim(), 'i')
		query = {galleryName: {$regex : regex}}
		// console.log(query)
	} 



	let skip = (page - 1)*limit;

	try{

		let [count, data] = await Promise.all([
			Gallery.count(query),
			Gallery.find(query)
			.sort({createdAt:-1}).skip(skip).limit(limit).select({_id : 1 , galleryName : 1 }).lean()
			])

		let listFileManager = [];


		if (count && count >0) {
			totalPage = Math.ceil(count/limit);
			
		}

		if (data && data.length) {
			listFileManager = data;

		}
		
		

		res.send({status: true, page : page,  totalPage : totalPage, listFileManager : listFileManager});
	}catch(err){
		res.send({status:false})
    // console.log("===============err=========================")
    console.log(err)
    // console.log("===============err=========================")
}

}

exports.listFileManagerImages = async(req,res) =>{
	console.log("req.cookies")
	console.log(req.cookies)
	console.log("req.cookies")

	let page = 1;
	let limit = 16;
	let totalPage = 1;
	let query = {};
	// console.log(req.query)
	// console.log(req.query.id)
	if (req.query.page) {
		page = parseInt(req.query.page);
	}
	if (req.query.id) {
		id = req.query.id;
	}else{
		id = req.cookies.currentColorId;
	}

	if(req.query.search_images && req.query.search_images !=""){
		let regex = new RegExp(req.query.search_images.trim(), 'i');
		query = {galleryName: {$regex : regex}};
		// console.log(query)
	} 



	let skip = (page - 1)*limit;

	try{

		let [count, data] = await Promise.all([
			Gallery.count(query),
			Gallery.find(query)
			.sort({createdAt:-1}).skip(skip).limit(limit).select({_id : 1 , galleryName : 1 }).lean()
			])

		let listFileManagerImages = [];


		if (count && count >0) {
			totalPage = Math.ceil(count/limit);
			
		}

		if (data && data.length) {
			listFileManagerImages = data;

		}
		
		// console.log("===============here==============")
		// console.log(id)

		res.send({status: true, page : page, id : id ,  totalPage : totalPage, listFileManagerImages : listFileManagerImages});
	}catch(err){
		res.send({status:false})
    // console.log("===============err=========================")
    console.log(err)
    // console.log("===============err=========================")
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

exports.validatorProductAdd = [
check('productName', 'Tên sản phẩm không được để trống').isLength({ min: 1 }),
check('productThumb', 'Vui lòng chọn ảnh đại diện sản phẩm').isLength({ min: 1 }),
check('productCategory', 'Vui lòng chọn danh mục sản phẩm').isLength({ min: 1 }),
check('productBrand', 'Vui lòng chọn nhãn hiệu sản phẩm').isLength({ min: 1 }),
check('productColor', 'Vui lòng chọn thông tin màu sắc sản phẩm').isLength({ min: 1 }),
]

exports.postProductAdd = async (req,res) => {
	if (req.body) {
		// console.log(req.body)
		// console.log(req.body)
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.send({status:false, errors : errors.array()});
		}
		// console.log(req.body.productColor[0].colorImages)

		if(req.body.productColor && req.body.productColor.length) {
			for (var i = 0; i < req.body.productColor.length; i++) {
				if (req.body.productColor[i].colorImages == undefined) {
					let errors = [{msg:"Vui lòng chọn ảnh sản phẩm tương ứng màu đã chọn"}]
					return res.send({status:false,errors:errors})
				}
				// console.log("====here=========")
				if (req.body.productColor[i].colorPrice == "") {
					let errors = [{msg:"Vui lòng điền giá sản phẩm tương ứng màu đã chọn"}]
					return res.send({status:false,errors:errors})
				}
				// console.log("vao day")
				if (req.body.productColor[i].colorQuantity == "") {
					let errors = [{msg:"Vui lòng điền số lượng sản phẩm tương ứng màu đã chọn"}]
					return res.send({status:false,errors:errors})
				}							
			}
		}

		try{
			const product = new Product({
				productName: req.body.productName,
				productThumb: req.body.productThumb,
				productCategory : req.body.productCategory,
				productBrand : req.body.productBrand,
				productColor : req.body.productColor,
				productDescription : req.body.productDescription ,
				productFeturesSolgan : req.body.productFeturesSolgan ,
				productFeturesBanner : req.body.productFeturesBanner , 
				productFeturesLink : req.body.productFeturesLink ,
				productInfoImage : req.body.productInfoImage , 
				productInfo : req.body.productInfo , 
				productSpecifications : req.body.productSpecifications 
			}); 

			// console.log(product)
			let saveProduct = await product.save();
			if (!saveProduct) {
				let errors = [{msg:"Thêm sản phẩm thất bại"}]
				return res.send({status:false,errors:errors});
			}else {
				return res.send({status:true})
			}
		}catch(errors){
			res.send({status:false, errors : errors});
			console.log(errors)
		}
		// console.log('vao day')
	}
}


exports.getProductEdit = async (req,res) =>{
	if (req.params && req.params.id) {
		try{
			let product = await Product.find({_id : req.params.id});
			let category = await Category.find({}).select({_id : 1, status :1, categoryName: 1}).lean();
			let brand = await Brand.find({}).select({_id : 1 , status : 1 ,  brandName : 1 }).lean();
			let color = await Color.find({}).select({_id : 1 , status : 1 ,  colorName : 1 }).lean();
			let gallery = await  Gallery.find({}).select({_id : 1 , galleryName : 1 }).lean();
			let specifications = await  Specifications.find({}).select({_id : 1 , specificationsName : 1 }).lean();

			// console.log(product[0].productColor)

			let colorTotal = []
			for (var i = 0; i < color.length; i++) {
				colorTotal.push(color[i]._id.toString())
			}			

			let productColorTotal = []
			for (var j = 0; j < product[0].productColor.length; j++) {
				productColorTotal.push(product[0].productColor[j].colorId.toString())
			}

			// let colorLeft = [];

			let colorLeft =  _.difference(colorTotal,productColorTotal);

			// console.log('here')

			let specificationsTotal = []
			for (var i = 0; i < specifications.length; i++) {
				specificationsTotal.push(specifications[i]._id.toString())
			}	

			// console.log(specificationsTotal)		
	
			let productSpecificationsTotal = []
			for (var j = 0; j < product[0].productSpecifications.length; j++) {
				productSpecificationsTotal.push(product[0].productSpecifications[j].productSpecificationsId.toString())
			}

			// console.log(productSpecificationsTotal)


			let specificationsLeft = await _.difference(specificationsTotal,productSpecificationsTotal);
			
			// console.log(specificationsLeft)

			res.render('backend/product/edit',{
				product:product[0],
				category : category ,
				brand : brand ,
				color : color,
				colorLeft : colorLeft,
				specifications : specifications ,
				specificationsLeft : specificationsLeft ,
				moment:moment
			})

		}catch(err){
		}
	}
}

exports.validatorProductEdit = [
check('productName', 'Tên sản phẩm không được để trống').isLength({ min: 1 }),
check('productThumb', 'Vui lòng chọn ảnh đại diện sản phẩm').isLength({ min: 1 }),
check('productCategory', 'Vui lòng chọn danh mục sản phẩm').isLength({ min: 1 }),
check('productBrand', 'Vui lòng chọn nhãn hiệu sản phẩm').isLength({ min: 1 }),
check('productColor', 'Vui lòng chọn thông tin màu sắc sản phẩm').isLength({ min: 1 }),
]

exports.postProductEdit = async (req,res) => {
	if (req.body) {

		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.send({status:false, errors : errors.array()});
		}
		
		
		if(req.body.productColor && req.body.productColor.length) {
			for (var i = 0; i < req.body.productColor.length; i++) {
				if (req.body.productColor[i].colorImages == undefined) {
					let errors = [{msg:"Vui lòng chọn ảnh sản phẩm tương ứng màu đã chọn"}]
					return res.send({status:false,errors:errors})
				}
				// console.log("====here=========")
				if (req.body.productColor[i].colorPrice == "") {
					let errors = [{msg:"Vui lòng điền giá sản phẩm tương ứng màu đã chọn"}]
					return res.send({status:false,errors:errors})
				}
				// console.log("vao day")
				if (req.body.productColor[i].colorQuantity == "") {
					let errors = [{msg:"Vui lòng điền số lượng sản phẩm tương ứng màu đã chọn"}]
					return res.send({status:false,errors:errors})
				}							
			}
		}
		
		try{
			const dataUpdate = {
				productName: req.body.productName,
				productThumb: req.body.productThumb,
				productCategory : req.body.productCategory,
				productBrand : req.body.productBrand,
				productColor : req.body.productColor,
				productDescription : req.body.productDescription,
				productFeturesSolgan : req.body.productFeturesSolgan ,
				productFeturesBanner : req.body.productFeturesBanner , 
				productFeturesLink : req.body.productFeturesLink ,
				productInfoImage : req.body.productInfoImage , 
				productInfo : req.body.productInfo , 
				productSpecifications : req.body.productSpecifications 
			}; 

			// console.log(dataUpdate)

			let updateProduct = await Product.update({ _id: req.body.id}, { $set: dataUpdate});

			if (updateProduct) {
				res.send({status:true});
			}
		}catch(errors){
			res.send({status:false, errors : errors});
			console.log(errors)
		}
		// console.log('vao day')
	}
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

