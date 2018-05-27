const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');
const mconnect = require('../config/connDB');
var Schema = mongoose.Schema;

const slideSchema = new mongoose.Schema({
	slideTitle : String ,
	slideContent : String ,
	slideLink : String,
	slideImage : String,
	isSlideMain : {type:Number , default : 0}, //1:true , 0:false
  status : {type : Number , default : 1} , //1 : active , 0: block 
}, { timestamps: true });

const Slide = mconnect.model('Slide', slideSchema);

module.exports = Slide;