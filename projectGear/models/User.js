const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');
const mconnect = require('../config/connDB');
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true }, 
  userName : String, 
  password: String, 
  avatar: String, 
  nameUser : String,
  phoneNumber : Number,
  address: String,
  birthDay : Date,
  gender : {type : Number , default : 0}, // 0 : Nam , 1 : Nữ
  role : {type: Number, default: 0}, // 0 : Normal, 1 : Admin
  level : {type: Number, default: 1}, // 1: Normal, 2: Silver, 3: Gold, 4: Platinum
  status: {type:Number, default: 1} // 0: block || 1: active 
  
}, { timestamps: true });

/**
 * Password hash middleware.
 */
 userSchema.pre('save', function save(next) {
  const user = this;
  if (!user.isModified('password')) { return next(); }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) { return next(err); }
      user.password = hash;
      next();
    });
  });
});

 userSchema.pre('update', function update(next) {
  const password = this.getUpdate().$set.password;
  if (!password) {
    return next();
  }
  try {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) { return next(err); }
      bcrypt.hash(password, salt, null, (err, hash) => {
        console.log(password);
        this.getUpdate().$set.password = hash;
        console.log(hash)
        next();
      });
    })
  } catch (error) {
    return next(error);
  }
  //const user = this;
  //console.log(user)
  //bcrypt.genSalt(10, (err, salt) => {
  //  if (err) { return next(err); }
  //  bcrypt.hash(user.password, salt, null, (err, hash) => {
  //    console.log(user.password)
  //    if (err) { return next(err); }
  //    user.password = hash;
  //    this.update({},{ $set: { password: user.password } });
  //    console.log(user.password)
  //    next();
  //  });
  //});
});


/**
 * Helper method for validating user's password.
 */
 userSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};

/**
 * Helper method for getting user's gravatar.
 */
 userSchema.methods.gravatar = function gravatar(size) {
  if (!size) {
    size = 200;
  }
  if (!this.email) {
    return `https://gravatar.com/avatar/?s=${size}&d=retro`;
  }
  const md5 = crypto.createHash('md5').update(this.email).digest('hex');
  return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
};

const User = mconnect.model('User', userSchema);

module.exports = User;
