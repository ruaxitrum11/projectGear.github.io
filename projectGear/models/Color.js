const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');
const mconnect = require('../config/connDB');
const Schema = mongoose.Schema;

const colorSchema = new mongoose.Schema({
	colorName : String ,
	colorCode : String ,
  status : {type : Number , default : 1} , //1 : active , 0: block 
  products: { type: Schema.Types.ObjectId, ref: 'Product' }

}, { timestamps: true });

const Color= mconnect.model('Color', colorSchema);

module.exports = Color