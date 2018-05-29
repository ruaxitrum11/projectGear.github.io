const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');
const mconnect = require('../config/connDB');
var Schema = mongoose.Schema;

const ipBlockedSchema = new mongoose.Schema({
	ipBlockedAddress : String ,
}, { timestamps: true });

const IpBlocked = mconnect.model('IpBlocked', ipBlockedSchema);

module.exports = IpBlocked;
