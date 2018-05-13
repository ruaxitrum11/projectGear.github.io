const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');
const mconnect = require('../config/connDB');
const Schema = mongoose.Schema;


const productSchema = new mongoose.Schema({
  productName : String ,
  productThumb : String, 
  productDescription : String,
  productBrand : { type: Schema.Types.ObjectId, ref: 'Brand' },
  productCategory : { type: Schema.Types.ObjectId, ref: 'Category' },
  productColor : [{
    colorId: { type: Schema.Types.ObjectId, ref: 'Color' },
    colorImages : [{type:String}],
    colorPrice : {type : Number},
    colorPromotion : {type : Number , default : 0},
    colorQuantity : {type : Number },
    colorNumberPurchased : { type : Number , default : 0}
  }],
  status : {type : Number , default : 1 } //1 : active , 2 : block
} , { timestamps: true });

const Product = mconnect.model('Product', productSchema);

module.exports = Product;