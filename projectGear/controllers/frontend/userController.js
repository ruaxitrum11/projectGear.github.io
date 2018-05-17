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
 const moment = require('moment');
 const path = require('path');

 const { check, validationResult } = require('express-validator/check');

//Setup multer upload
let storage = multer.diskStorage({
    // Configuring multer to upload folder
    destination: function(req, file, cb) {
      cb(null, './public/upload/avatar')
    },
    // Rename file to save in the database.
    filename: function(req, file, cb) {
      var ext = file.originalname.split('.')
      cb(null, ext[0]+ '_' + Date.now() + '.' + ext[ext.length - 1]);
    }
  });

let upload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname)
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
      return callback(new Error('Chỉ cho phép tải ảnh lên'))
    }

    callback(null, true)
  }
}).single('file');


// Models
const User = require('../../models/User');
const Product = require('../../models/Product');
const Category = require('../../models/Category');
const Brand = require('../../models/Brand');
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


exports.postLogin = async (req,res, next)=>{


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
        return res.send({status: false, msg: 'Đăng nhập thất bại. Vui lòng thử lại!  '});
      }

      req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;

      req.logIn(user, function(err) {
        if (err) {
          // console.log('ERROR ========== 003');
          // console.log(err);
          return res.send({status: false, msg: 'Đăng nhập thất bại. Vui lòng thử lại! '});
        }
        return res.send({status: true, redirect: '/'});
        // req.flash("Đăng nhập thành công");
        // return res.redirect('/');
      });
    })(req, res, next);
  }



  exports.logOut = (req,res) =>{
    req.logout();
    res.redirect('/');
  }

  exports.getUserInfo = async (req,res) => {
    // console.log('vao day')
    // console.log(req.params)

    let categoryMenu = await Category.find({isCategoryMenu : 1 , status : 1}).sort({createdAt:1}).limit(4).lean();
    // console.log(categoryMenu)
    let categoryDropDown = await Category.find({isCategoryMenu : 0 , status : 1} ).sort({createdAt:1}).lean();
    let category = await Category.find({status:1}).sort({createdAt:1}).lean(); 

    let userCurrent = await User.find({_id : req.params.userId})

    // console.log(userCurrent)
    return res.render('frontend/userInfo' , {
      categoryMenu : categoryMenu ,
      categoryDropDown : categoryDropDown , 
      category : category ,
      userCurrent : userCurrent[0],
      moment : moment
    })
  }

  exports.updateUserInfo = async (req,res) => {
    upload (req,res,async function(err) {
      if(err) {
        console.log(err);
        return res.send({status:false, err : err});
      }

      try{
        if (req.body) {
          // console.log(req.body)

          const userDataUpdate = {
            nameUser : req.body.nameUser,
            email : req.body.email,
            phoneNumber : req.body.phoneNumber,
            address : req.body.address,
            birthDay : req.body.birthDay,
            gender : req.body.gender ,
          };
            // console.log(userDataUpdate)
            if (req.file) {
              userDataUpdate.avatar = req.file.filename;
            }

          console.log(userDataUpdate)

          let updateUserInfo = await User.update({ _id: req.body.userIdUpdate}, { $set: userDataUpdate});

          console.log('vao day')
          console.log(updateUserInfo)
          if (updateUserInfo) {
            return res.send({status:true});
          }
        }
      }
      catch(errors){
        return res.send({status:false, errors : errors});
      }

    })
  }