/***********************
 * Module dependencies.
 **********************/
 const cluster = require('cluster');
 const request = require('request');
 const _ = require('lodash');
 const fs = require('fs');
 const download = require('download');
 const async = require('async');

// Models
const User = require('../../models/User');
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
