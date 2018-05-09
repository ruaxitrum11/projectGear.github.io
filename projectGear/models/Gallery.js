const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');
const mconnect = require('../config/connDB');
var Schema = mongoose.Schema;

const gallerySchema = new mongoose.Schema({
	galleryName : String ,
}, { timestamps: true });

const Gallery = mconnect.model('Gallery', gallerySchema);

module.exports = Gallery;
