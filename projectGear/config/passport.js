const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt-nodejs');

const User = require('../models/User');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id).then(function (user) {
    done(null, user);
  }).catch(function (err) {
    console.log(err);
  })
});

passport.use(new LocalStrategy({ 
  usernameField: 'username',
  passwordField:'password' 
}, (username, password, done) => {
  User.findOne({userName: username}, (err, user) => {
    if (err) { return done(err); }
    if (!user) {
      return done(null, false, { message: 'Tài khoản không tồn tại !' });
    }

    // console.log(user);

    if (!bcrypt.compareSync(password, user.password)) {
      return done(null, false, { message: 'Sai mật khẩu !' });
    }
    return done(null, user);
  });
}
));

exports.isAuthenticated = (req, res, next) => {
  if(req.isAuthenticated() && req.user.status == 1){
    return next();
  }
  return res.redirect('/');
}

exports.isAuthAdmin = (req, res, next) => {
  if(req.user && req.user.role == 1){
    return next();
  }else {
    return res.redirect("/");
  }
}