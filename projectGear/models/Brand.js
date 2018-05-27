const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');
const mconnect = require('../config/connDB');
var Schema = mongoose.Schema;

const brandSchema = new mongoose.Schema({
	brandName : String ,
  status : {type : Number , default : 1} , //1 : active , 0: block 
  // products: [{ type: Schema.Types.ObjectId, ref: 'Product' }]
}, { timestamps: true });

const Brand = mconnect.model('Brand', brandSchema);

module.exports = Brand;