const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');
const mconnect = require('../config/connDB');
const Schema = mongoose.Schema;


const productSchema = new mongoose.Schema({
	productName : String ,
	productThumb : String ,
  productBanner : String,
  numberPurchased : { type : Number , default : 0},
  price : Number,
  quantity: Number,
  description : String,
  productBrand : { type: Schema.Types.ObjectId, ref: 'Brand' },
  productCategory : [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  productColor : { type: Schema.Types.ObjectId, ref: 'Color' },
  	status : {type : Number , default : 1} , //1 : còn hàng , 0: hết hàng  

  }, { timestamps: true });

const Product = mconnect.model('Product', productSchema);

module.exports = Product;