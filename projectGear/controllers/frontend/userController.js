/***********************
 * Module dependencies.
 **********************/
 const cluster = require('cluster');
 const request = require('request');
 const _ = require('lodash');
 const fs = require('fs');
 const download = require('download');
 const async = require('async');
 const passport = require('passport');
 const mongoose = require('mongoose');
 const multer = require("multer");
 const Entities = require('html-entities').XmlEntities;
 const entities = new Entities();

 const { check, validationResult } = require('express-validator/check');

// Models
const User = require('../../models/User');
// Method
/**
 * GET /
 * Home page.
 */

 exports.validatorCreateUser = [
 check('userName', 'Tài khoản phải có ít nhất 4 ký tự').isLength({ min: 4 }),
 check('email', 'Email không hợp lệ').isEmail(),
 check('password', 'Mật khẩu phải có ít nhất 4 ký tự').isLength({ min: 4 }),
 check('password_confirm', 'Mật khẩu không trùng khớp').custom((value, { req }) => value === req.body.password)
 ]

exports.create = async (req, res) => {
  if (req.body) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.send({status:false, errors : errors.array()});
    }

    try{
      const user = new User({
        userName: req.body.userName,
        email: req.body.email,
        password: req.body.password
      });

      
     

      let existingUser = await User.findOne({userName: req.body.userName});
      let existingEmail = await User.findOne({email: req.body.email});

      if (existingUser) {
        let errors = [{msg:"Tài khoản này đã được sử dụng"}]
        return res.send({status:false, errors : errors});
      }else if (existingEmail) {
        let errors = [{msg:"Email này đã được sử dụng"}]
        return res.send({status:false, errors : errors});
      }else {
        let saveUser = await user.save();
        if (saveUser) {
          return res.send({status:true});
        }else{
          let errors = [{msg:"Đăng kí thất bại. Vui lòng thử lại sau"}]
          return res.send({status:false, errors : errors});
        }
      }
    }catch(err){
      console.log("===============err=========================")
      console.log(err)
      console.log("===============err=========================")
    }
    console.log("Done")
  }
}

exports.validatorLoginUser = [
check('username', 'Tài khoản không được để trống').isLength({ min: 1 }),
check('password', 'Mật khẩu không được để trống').isLength({ min: 1 }),
]

exports.postLogin = async (req,res, next)=>{
  console.log(req.body)
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.send({status:false, errors : errors.array()});
  }

  passport.authenticate('local', function(err, user, info) {
    // console.log('authenticate ========== err');
    //   console.log(err);
      // console.log('authenticate ========== user');
      // console.log(user);
      // console.log('authenticate ========== info');
      // console.log(info);
      if (err) {
        // console.log('ERROR ========== 001');
        // console.log(err);
        return res.send({status: false, msg: 'Đăng nhập thất bại. Vui lòng thử lại!'});
      }
      if (!user) {
        // console.log('ERROR ========== 002');
        return res.send({status: false, msg: 'Đăng nhập thất bại. Vui lòng thử lại!'});
      }

      req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;

      req.logIn(user, function(err) {
        if (err) {
          // console.log('ERROR ========== 003');
          // console.log(err);
          return res.send({status: false, msg: 'Đăng nhập thất bại. Vui lòng thử lại!'});
        }
        // return res.send({status: true, redirect: '/'});
        req.flash("Đăng nhập thành công");
        return res.redirect('/');
      });
    })(req, res, next);
}

exports.logOut = (req,res) =>{
    req.logout();
  res.redirect('/');
}