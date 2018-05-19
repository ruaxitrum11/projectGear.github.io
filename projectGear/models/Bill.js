const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');
const mconnect = require('../config/connDB');
const Schema = mongoose.Schema;


const billSchema = new mongoose.Schema({
  bill : String ,
  productThumb : String, 
  productDescription : String,
 
  status : {type : Number , default : 1 } //1 : processing , 2 : completed , 3 : canceled
} , { timestamps: true });

const Bill = mconnect.model('Bill', billSchema);

module.exports = Bill;

