const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');
const mconnect = require('../config/connDB');
const Schema = mongoose.Schema;


const billSchema = new mongoose.Schema({
	billNumber : Number,
	productInfos : [{
		productId : Schema.Types.ObjectId ,
		productName :String ,
		productColorId : Schema.Types.ObjectId,
		productColorCode : String,
		productImage :String,
		productPrice : Number,
		productQuantity : Number,
	}] ,
	totalPrice : Number,
	billPrice : Number , 
	billPromotion : Number ,
	clientIp : String ,
	clientName : String ,
	clientEmail : String ,
	clientPhoneNumber : Number ,
	clientAddress : String ,
	clientDescription : String,
  status : {type : Number , default : 1 } //1 : processing , 2 : completed , 3 : canceled , 4 : chờ xác nhận
} , { timestamps: true });

const Bill = mconnect.model('Bill', billSchema);

module.exports = Bill;

