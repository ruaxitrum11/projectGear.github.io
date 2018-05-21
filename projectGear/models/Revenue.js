const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');
const mconnect = require('../config/connDB');
var Schema = mongoose.Schema;

const revenueSchema = new mongoose.Schema({
	totalBill : Number 
}, { timestamps: true });

const Revenue = mconnect.model('Revenue', revenueSchema);

module.exports = Revenue;