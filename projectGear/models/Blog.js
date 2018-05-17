const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');
const mconnect = require('../config/connDB');
var Schema = mongoose.Schema;

const blogSchema = new mongoose.Schema({
	blogImage : String,
	blogTitle : String ,
	blogDescription :String,
	blogAuthor : String ,
	blogContent : String ,
  status : {type : Number , default : 1} , //1 : active , 0: block 
}, { timestamps: true });

const Blog = mconnect.model('Blog', blogSchema);

module.exports = Blog;