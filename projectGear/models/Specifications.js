const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');
const mconnect = require('../config/connDB');
var Schema = mongoose.Schema;

const specificationsSchema = new mongoose.Schema({
	specificationsName : String ,
  status : {type : Number , default : 1} , //1 : active , 0: block 
}, { timestamps: true });

const Specifications = mconnect.model('Specifications', specificationsSchema);

module.exports = Specifications;