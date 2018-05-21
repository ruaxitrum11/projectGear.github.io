/***********************
 * Module dependencies.
 **********************/
 const cluster = require('cluster');
 const request = require('request');
 const _ = require('lodash');
 const fs = require('fs');
 const download = require('download');
 const async = require('async');
 const moment = require('moment');


// Models
const User = require('../../models/User');
const Revenue = require('../../models/Revenue');
// Method
/**
 * GET /
 * Home page.
 */
 exports.admin = async (req, res) => {
  // let userAdmin = await User.find({status:1,role:1})
  // console.log("Index Frontend")
  
  return res.render('backend/admin' , {
    // userAdmin : userAdmin[0]
});
}

exports.revenue = async (req,res) => {

	try {
		let revenue = await Revenue.find({}).lean()


		return res.send({status:true,revenue:revenue,moment:moment})

	}catch(errors){
		return res.send({status:false,errors:errors})
	}
}
