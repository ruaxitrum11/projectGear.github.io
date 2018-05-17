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
    	cb(null, './public/upload/blog')
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
}).single('fileBlog');

 // Models
 const Blog = require('../../models/Blog');


// Method
/**
 * GET /
 * Admin/product/list.
 */

 exports.list = async (req, res) => {
 	return res.render('backend/blog/list');
 }

 exports.listBlog = async (req,res) =>{
 	let page = 1;
 	let limit = 20;
 	let totalPage = 1;
 	let query = {};
 	if (req.query.page) {
 		page = parseInt(req.query.page);
 	}

 	if(req.query.blog_author && req.query.blog_author !=""){
 		let regex = new RegExp(req.query.blog_author.trim(), 'i')
 		query = {blogAuthor: {$regex : regex}}
 	} 

 	if (req.query.blog_status && req.query.blog_status !="") {
 		query['status'] = req.query.blog_status;
 	}


 	
 	let skip = (page - 1)*limit;

 	try{
 		let [count, data] = await Promise.all([
 			Blog.count(query),
 			Blog.find(query)
 			.sort({createdAt : -1 , isMain:1}).skip(skip).limit(limit)
 			])

 		let listBlog = [];

 		if (count && count >0) {
 			totalPage = Math.ceil(count/limit);
 		}

 		if (data && data.length) {
 			listBlog = data;
 		}

 		res.send({status: true, page : page, totalPage : totalPage, listBlog : listBlog});



 	}catch(err){
 		res.send({status:false})
    // console.log("===============err=========================")
    console.log(err)
    // console.log("===============err=========================")
}
}

exports.getBlogAdd = async (req,res) => {
	res.render('backend/blog/add');
}

exports.postBlogAdd = async (req,res) => {
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
				
				if (req.body.blogTitle == "") {
					let errors = [{msg:"Tiêu đề tin tức không được để trống"}]
					return res.send({status:false, errors : errors});
				} else if (req.body.blogDescription == ""){
					let errors = [{msg:"Mô tả tin tức không được để trống"}]
					return res.send({status:false, errors : errors});
				}else if (req.body.blogAuthor == ""){
					let errors = [{msg:"Tác giả không được để trống"}]
					return res.send({status:false, errors : errors});
				}else if (req.body.blogContent == ""){
					let errors = [{msg:"Nội dung tin tức không được để trống"}]
					return res.send({status:false, errors : errors});
				}else{

					const blog = new Blog({
						blogTitle : req.body.blogTitle,
						blogDescription : req.body.blogDescription,
						blogAuthor : req.body.blogAuthor,
						blogContent : req.body.blogContent,
					});

					if (req.file) {
						blog.blogImage = req.file.filename;
					}

					let saveBlog = await blog.save();
					if (!saveBlog) {
						let errors = [{msg:"Thêm tin tức thất bại"}]
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


exports.getBlogEdit = async (req,res) =>{
	if (req.params && req.params.id) {
		try{
			let blog = await Blog.find({_id : req.params.id});
			res.render('backend/blog/edit',{blog:blog[0],moment:moment})
		}catch(err){
		}
	}
}

exports.postBlogEdit = async (req,res) => {
	upload (req,res,async function(err) {
		if(err) {
			console.log(err);
			return res.send({status:false, err : err});
		}

		try{
			// console.log(req.body)
			if (req.body) {
				
				if (req.body.blogTitle == "") {
					let errors = [{msg:"Tiêu đề tin tức không được để trống"}]
					return res.send({status:false, errors : errors});
				} else if (req.body.blogDescription == ""){
					let errors = [{msg:"Mô tả tin tức không được để trống"}]
					return res.send({status:false, errors : errors});
				}else if (req.body.blogAuthor == ""){
					let errors = [{msg:"Tác giả không được để trống"}]
					return res.send({status:false, errors : errors});
				}else if (req.body.blogContent == ""){
					let errors = [{msg:"Nội dung tin tức không được để trống"}]
					return res.send({status:false, errors : errors});
				}else{

					const blogDataUpdate = {
						blogTitle : req.body.blogTitle,
						blogDescription : req.body.blogDescription,
						blogAuthor : req.body.blogAuthor,
						blogContent : req.body.blogContent,
						status : req.body.status
					};

					if (req.file) {
						blogDataUpdate.blogImage = req.file.filename;
					}

					let updateBlog = await Blog.update({ _id: req.body.id}, { $set: blogDataUpdate});
					if (!updateBlog) {
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



exports.deleteBlog = async (req,res) =>{
	if (req.body.id) {
		try{
			let deleteBlog = await Blog.remove({_id : req.body.id});
			if (deleteBlog.result) {
				res.send({status:true});
			}else{
				res.send({status:false});
			}
		}catch(err){
			res.send({status:false})
		}
	}
}