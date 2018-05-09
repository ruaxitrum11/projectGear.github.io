const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');
const mconnect = require('../config/connDB');
var Schema = mongoose.Schema;

const slideSchema = new mongoose.Schema({
	slideName : String ,
	slideImage : String,
  status : {type : Number , default : 1} , //1 : active , 0: block 
  product: { type: Schema.Types.ObjectId, ref: 'Product' }
}, { timestamps: true });

const Slide = mconnect.model('Slide', slideSchema);

module.exports = Slide;