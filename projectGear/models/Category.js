const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');
const mconnect = require('../config/connDB');
const Schema = mongoose.Schema;

const categorySchema = new mongoose.Schema({
	categoryName : String ,
	categoryNameSummary : String ,
	categoryBanner : String ,
	isCategoryMenu : {type : Number , default : 0}, //non-active , 1 : active
  status : {type : Number , default : 1} , //1 : active , 0: block 
  products: [{ type: Schema.Types.ObjectId, ref: 'Product' }]

}, { timestamps: true });

const Category= mconnect.model('Category', categorySchema);

module.exports = Category