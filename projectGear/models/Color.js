const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');
const mconnect = require('../config/connDB');
var Schema = mongoose.Schema;

const colorSchema = new mongoose.Schema({
	colorName : String ,
	colorCode : String ,
  status : {type : Number , default : 1} , //1 : active , 0: block 
}, { timestamps: true });

const Color = mconnect.model('Color', colorSchema);

module.exports = Color;