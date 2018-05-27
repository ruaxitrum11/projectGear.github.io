const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');
const mconnect = require('../config/connDB');
var Schema = mongoose.Schema;

const ipBlockedSchema = new mongoose.Schema({
	ipBlockedAddress : String ,
	status : {type : Number , default : 1} //1:block , 0:unblock
}, { timestamps: true });

const ipBlocked = mconnect.model('IpBlocked', ipBlockedSchema);

module.exports = IpBlocked;
