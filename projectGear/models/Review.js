const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');
const mconnect = require('../config/connDB');
var Schema = mongoose.Schema;

const reviewSchema = new mongoose.Schema({
	reviewName : String , 
	reviewImage : String ,
	reviewDescription : String ,
	reviewContent : String , 
	status : {type:Number , default : 1 } //1:active , 0 :non-active
}, { timestamps: true });

const Review = mconnect.model('Review', reviewSchema);

module.exports = Review;