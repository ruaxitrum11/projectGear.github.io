const cluster = require('cluster');
const request = require('request');
const _ = require('lodash');
const fs = require('fs');
const download = require('download');
const async = require('async');
const bcrypt = require('bcrypt-nodejs');
const multer = require('multer');
const path = require('path');
const moment = require('moment');



const { check, validationResult } = require('express-validator/check');


 // Models
 // const Slide = require('../../models/Slide');
 const Bill = require('../../models/Bill');
 const IpBlocked = require('../../models/IpBlocked')

// Method
/**
 * GET /
 * Admin/product/list.
 */

 exports.revenue = async (req, res) => {
 	return res.render('backend/statistical/revenue');
 }

 exports.status = async (req, res) => {
 	return res.render('backend/statistical/status');
 }

 exports.product = async (req, res) => {
 	return res.render('backend/statistical/product');
 }

 exports.listIpCancel = async (req, res) => {
 	
 	try{
 		let data = await Bill.find({status:3}).sort({createdAt : -1 }).select({clientIp:1})


 		let listIpCancelArray = [];


 		if (data && data.length) {
 			listIpCancelArray = data;
 		}
 		// console.log(listIpCancel)


 		var x = listIpCancelArray.map(y => ({ clientIp: y.clientIp}))

 		// console.log(x)

 		const listIpCancel = [...x.reduce( (mp, o) => {
 			if (!mp.has(o.clientIp)) mp.set(o.clientIp, Object.assign({ countClientIp: 0 }, o));
 			mp.get(o.clientIp).countClientIp++;
 			return mp;
 		}, new Map).values()];

 		// console.log(listIpCancel);

 		return res.send({status: true,  listIpCancel : listIpCancel});



 	}catch(err){
 		res.send({status:false})
    // console.log("===============err=========================")
    console.log(err)
    // console.log("===============err=========================")
}
}

exports.postIpBlock = async (req,res) => {
	try{
		if (req.body) {
			
			let existingIp = await IpBlocked.findOne({ ipBlockedAddress : req.body.ip});

			if (existingIp && existingIp != "") {
				let errors = [{msg:'Địa chỉ Ip : '+req.body.ip+'  đã bị chặn'}]
				return res.send({status:false, errors : errors});
			}

			const ipblocked = new IpBlocked({
				ipBlockedAddress : req.body.ip
			});

			let saveIp = await ipblocked.save();
			if (!saveIp) {
				let errors = [{msg:"Chặn Ip thất bại"}]
				return res.send({status:false, errors : errors});
			}
			return res.send({status:true , msg : 'Chặn Ip : ' +req.body.ip+' thành công'});

			
		}
	}
	catch(errors){
		console.log(errors);
		return res.send({status:false, errors : errors});
	}
	
}