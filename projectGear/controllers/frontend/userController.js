/***********************
 * Module dependencies.
 **********************/
 const cluster = require('cluster');
 const request = require('request');
 const _ = require('lodash');
 const fs = require('fs');
 const download = require('download');
 const async = require('async');
 const bcrypt = require('bcrypt-nodejs');
 const passport = require('passport');
 const mongoose = require('mongoose');
 const multer = require("multer");
 const Entities = require('html-entities').XmlEntities;
 const entities = new Entities();
 const moment = require('moment');
 const path = require('path');
 var nodemailer =  require('nodemailer')

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
const Bill = require('../../models/Bill');
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
    res.redirect('back');
  }

  exports.forgotPassword = async(req,res) => {
    if(req.body) {

      try{


        user = await User.find({$or:[{userName:req.body.userName} , {email:req.body.userName}]}) 

        if(!user || user.length == 0) {
          let errors = [{msg:"Vui lòng nhập đúng tài khoản hoặc email của bạn"}]
          return res.send({status:false, errors:errors})
        }
        else {
          let newPassword =  Date.now()

          let dataUpdate = {
            password : newPassword,
          }

          let updateUser = await User.update({ _id: user[0]._id}, { $set: dataUpdate});

          if (updateUser) {
            let transporter =  nodemailer.createTransport({ // config mail server
              service: 'Gmail',
              auth: {
                user: 'ghostgaminggear@gmail.com',
                pass: 'hieu5894'
              }
            });


            var xhtml = '';

            xhtml += '<p>Chào <span style="font-size:2rem;font-weight:bold">'+user[0].nameUser+'</span> , </p>';
            xhtml += '<p>Mật khẩu mới của bạn là : <span style="font-size:2rem;font-weight:bold">'+newPassword+'</span></p>';
            xhtml += '<p>Mọi ý kiến thắc mắc , xin vui lòng liên hệ : </p>';
            xhtml += '<ul>';
            xhtml += '<li><span>Website</span> : ghostgaminggear.com.vn </li>';
            xhtml += '<br>'
            xhtml += '<li><span>Email</span> : ghostgaminggear@gmail.com</li>';
            xhtml += '<br>'
            xhtml += '<li><span>Facebook</span> : https://www.facebook.com/ghostgamingear</li>';
            xhtml += '<br>'
            xhtml += '<li><span>Youtube</span> : https://www.youtube.com/ghostgamingear</li>';
            xhtml += '<br>'
            xhtml += '<li><span>Twitter</span> : https://www.twitter.com/ghostgamingear</li>';
            xhtml += '<br>'
            xhtml += '<li><span>Twitch</span>: https://www.twitch.com/ghostgamingear</li>';
            xhtml += '<br>'
            xhtml += '<li><span>Instagram</span> : https://www.instagram.com/ghostgamingear</li>';
            xhtml += '</ul>';


          let mainOptions = { // thiết lập đối tượng, nội dung gửi mail
            from: 'Ghost Gaming Gear',
            to: ''+user[0].email+'',
            subject: 'GhostGamingGear thông báo mật khẩu tài khoản của bạn ' ,
            text: 'You recieved message from ' ,
            html: xhtml
          }

          transporter.sendMail(mainOptions, function(err, info){
            if (err) {
              console.log(err);
              // res.redirect('/');
            } else {
              console.log('Message sent: ' +  info.response);
              // res.redirect('/');
            }
          });



          return res.send({status:true});
        }
      }
    }catch(errors){
      console.log(errors);
      return res.send({status:false, errors : errors});
    }
  }
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

  exports.getOrderHistory = async (req,res) => {
  // console.log(req.params)
  let categoryMenu = await Category.find({isCategoryMenu : 1 , status : 1}).sort({createdAt:1}).limit(4).lean();
    // console.log(categoryMenu)
    let categoryDropDown = await Category.find({isCategoryMenu : 0 , status : 1} ).sort({createdAt:1}).lean();
    let category = await Category.find({status:1}).sort({createdAt:1}).lean(); 

    let userCurrent = await User.find({_id : req.params.userId})

    // console.log(userCurrent)
    return res.render('frontend/orderHistory' , {
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

            // console.log('vao day')
            // console.log(updateUserInfo)
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

  exports.showOderHistory = async (req,res) => {
    if(req.query) {

      let limit = 10;
      let totalPage = 1;
      let query = {};

      let page = parseInt(req.query.page);


      let skip = (page - 1)*limit;

      try{

        let userIdCurrent = mongoose.Types.ObjectId(req.query.userIdCurrent)
      // console.log(userIdCurrent)
      // console.log(limit)
      // console.log(skip)
      let [count , userInformation ] = await Promise.all([
        User.aggregate([
          {$match: {_id : userIdCurrent }},
          {$project: {
            email :1,
          }},
          {$lookup : {
            from : "bills",
            localField : "email",
            foreignField : "clientEmail",
            as : "emailForeign"
          }},
          {$unwind : "$emailForeign"},
          {$count:"count"},
          ]), 
        User.aggregate([
          {$match: {_id : userIdCurrent }},
          {$project: {
            email :1,
          }},
          {$lookup : {
            from : "bills",
            localField : "email",
            foreignField : "clientEmail",
            as : "emailForeign"
          }},
          {$unwind : "$emailForeign"},
          {$skip:skip},
          {$limit:limit}
          ])
        ]) 

      // console.log(userInformation)
      // console.log(count[0].count)
      if (count[0].count && parseInt(count[0].count) >0) {
        totalPage = Math.ceil(parseInt(count[0].count)/limit);
      }
        // console.log('aaaaaaaaaaaa')
        // console.log(userInformation)
        // console.log(userInformation[0].emailForeign)
        // console.log(page)
        // console.log(totalPage)
        return res.send({status:true, page : page, totalPage : totalPage , userInformation : userInformation})
      }catch(errors){
        console.log(errors);
        return res.send({status:false, errors : errors});
      }
    }
  }

  exports.confirmCompleted = async (req,res) => {
    if(req.body) {
      try{
        let dataUpdate = {
          status : req.body.status,
        }

        let updateBill = await Bill.update({ _id: req.body.id}, { $set: dataUpdate});

        if (!updateBill) {
          let errors = [{msg:"Cập nhật đơn hàng thất bại"}]
          return res.send({status:false,errors : errors});
        }else{

         let billCurrent = await Bill.find({_id:req.body.id})
         // console.log(billCurrent)

            let transporter =  nodemailer.createTransport({ // config mail server
              service: 'Gmail',
              auth: {
                user: 'ghostgaminggear@gmail.com',
                pass: 'hieu5894'
              }
            });


            var xhtml = '';

            xhtml += '<p>Chào <span style="font-size:2rem;font-weight:bold">Ghost Gaming Gear</span> , </p>';
            xhtml += '<p>Mã đơn hàng : <span style="font-size:2rem;font-weight:bold">'+billCurrent[0].billNumber+'</span> đang trong trạng thái chờ xác nhận thành công</p>';
            xhtml += '<p>Tổng hóa đơn : <span style="font-size:2rem;font-weight:bold">'+billCurrent[0].billPrice+'</span> VNĐ</p>';
            xhtml += '<p>Khuyến mãi : <span style="font-size:2rem;font-weight:bold">'+billCurrent[0].billPromotion+'</span> %</p>';
            xhtml += '<p>Tổng thanh toán : <span style="font-size:2rem;font-weight:bold">'+billCurrent[0].totalPrice+'</span> VNĐ</p>';
            xhtml += '<p>Vui lòng xác nhận đơn hàng nhanh nhất có thể !</p>';
            xhtml += '<p>Mọi ý kiến thắc mắc , xin vui lòng liên hệ : </p>';
            xhtml += '<ul>';
            xhtml += '<li><span>Website</span> : ghostgaminggear.com.vn </li>';
            xhtml += '<br>'
            xhtml += '<li><span>Email</span> : ghostgaminggear@gmail.com</li>';
            xhtml += '<br>'
            xhtml += '<li><span>Facebook</span> : https://www.facebook.com/ghostgamingear</li>';
            xhtml += '<br>'
            xhtml += '<li><span>Youtube</span> : https://www.youtube.com/ghostgamingear</li>';
            xhtml += '<br>'
            xhtml += '<li><span>Twitter</span> : https://www.twitter.com/ghostgamingear</li>';
            xhtml += '<br>'
            xhtml += '<li><span>Twitch</span>: https://www.twitch.com/ghostgamingear</li>';
            xhtml += '<br>'
            xhtml += '<li><span>Instagram</span> : https://www.instagram.com/ghostgamingear</li>';
            xhtml += '</ul>';

            // var mailList = ''+billCurrent[0].clientEmail+',ghostgaminggear@gmail.com';
            // console.log(mailList)

          let mainOptions = { // thiết lập đối tượng, nội dung gửi mail
            from: 'Ghost Gaming Gear',
            to: 'ghostgaminggear@gmail.com',
            subject: 'GhostGamingGear thông báo đơn hàng , mã hóa đơn : '+billCurrent[0].billNumber+' cần được xác nhận hoàn thành' ,
            text: 'You recieved message from ' ,
            html: xhtml
          }

          transporter.sendMail(mainOptions, function(err, info){
            if (err) {
              console.log(err);
              // res.redirect('/');
            } else {
              console.log('Message sent: ' +  info.response);
              // res.redirect('/');
            }
          });
          return res.send({status:true});
        } 

      }catch(errors){
        console.log(errors);
        return res.send({status:false, errors : errors});
      }
    }
  }

  // exports.showInfoUser = async (req,res) => {
  //   if(req.body) {
  //     try{
  //       let userIdCurrent = mongoose.Types.ObjectId(req.body.userIdCurrent)
  //       let userInforProfile = await User.find({_id : userIdCurrent})

  //       let userBill = await User.aggregate([
  //         {$match: {_id : userIdCurrent }},
  //         {$project: {
  //           email :1,
  //         }},
  //         {$lookup : {
  //           from : "bills",
  //           localField : "email",
  //           foreignField : "clientEmail",
  //           as : "emailForeign"
  //         }},
  //         {$unwind:"$emailForeign" },
  //         {$match : {"emailForeign.status":2}}
  //         ])  



  //       console.log(userBill)
  //       return res.send({status:true,userInforProfile : userInforProfile[0] , userBill : userBill})
  //     }catch(errors){
  //       console.log(errors);
  //       return res.send({status:false, errors : errors});
  //     }
  //   }
  // }

  exports.getTrophy = async(req,res) => {
    // console.log(req.params)
    let categoryMenu = await Category.find({isCategoryMenu : 1 , status : 1}).sort({createdAt:1}).limit(4).lean();
    // console.log(categoryMenu)
    let categoryDropDown = await Category.find({isCategoryMenu : 0 , status : 1} ).sort({createdAt:1}).lean();
    let category = await Category.find({status:1}).sort({createdAt:1}).lean(); 

    let userCurrent = await User.find({_id : req.params.userId})

    let userIdCurrent = mongoose.Types.ObjectId(req.params.userId)
    

    let userBill = await User.aggregate([
      {$match: {_id : userIdCurrent }},
      {$project: {
        email :1,
      }},
      {$lookup : {
        from : "bills",
        localField : "email",
        foreignField : "clientEmail",
        as : "emailForeign"
      }},
      {$unwind:"$emailForeign" },
      {$match : {"emailForeign.status":2}}
      ])  

    let totalPrice = 0;

    if(userBill && userBill.length){
     for (var i = 0; i < userBill.length; i++) {
      totalPrice += userBill[i].emailForeign.totalPrice
    }
  }
  // console.log(totalPrice)

    // console.log(userCurrent)
    return res.render('frontend/trophy' , {
      categoryMenu : categoryMenu ,
      categoryDropDown : categoryDropDown , 
      category : category ,
      userCurrent : userCurrent[0],
      totalPrice : totalPrice ,
      moment : moment
    })
  }

  exports.upLevelUser = async (req,res) => {
    if(req.body) {
      try{
        let dataUpdate = {
          level : req.body.level,
        }
        let updateUser = await User.update({ _id: req.body.userIdCurrent}, { $set: dataUpdate});

        if (!updateUser) {
          let errors = [{msg:"Cập nhật danh hiệu thất bại"}]
          return res.send({status:false,errors : errors});
        }else{
          return res.send({status:true});
        } 

      }catch(errors){
        console.log(errors);
        return res.send({status:false, errors : errors});
      }
    }
  }


  exports.getChangePass = async (req,res) => {
  // console.log(req.params)
  let categoryMenu = await Category.find({isCategoryMenu : 1 , status : 1}).sort({createdAt:1}).limit(4).lean();
    // console.log(categoryMenu)
    let categoryDropDown = await Category.find({isCategoryMenu : 0 , status : 1} ).sort({createdAt:1}).lean();
    let category = await Category.find({status:1}).sort({createdAt:1}).lean(); 

    let userCurrent = await User.find({_id : req.params.userId})

    // console.log(userCurrent)
    return res.render('frontend/changePass' , {
      categoryMenu : categoryMenu ,
      categoryDropDown : categoryDropDown , 
      category : category ,
      userCurrent : userCurrent[0],
      moment : moment
    })
  }



  exports.validatorChangePassword = [
  check('new_pass', 'Mật khẩu mới phải có ít nhất 4 ký tự').isLength({ min: 4 }),
  check('confirm_new_pass', 'Mật khẩu mới không trùng khớp').custom((value, { req }) => value === req.body.new_pass)
  ]

  exports.changePassword = async(req,res) => {

    if(req.body) {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.send({status:false, errors : errors.array()});
      }

      try{

        let dataUpdate = {
          password : req.body.new_pass,
        }

        let updateUser = await User.update({ _id: req.body.userIdCurrent}, { $set: dataUpdate});

        if (updateUser) {
         return res.send({status:true});
       }

     }catch(errors){
      console.log(errors);
      return res.send({status:false, errors : errors});
    }
  }
}