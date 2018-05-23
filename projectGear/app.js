var express = require('express');
const session = require('express-session');
const flash = require('express-flash');
var moment = require('moment');
var fs = require('fs');
var app = express();
const lusca = require('lusca');
var multer = require('multer');
const passport = require('passport');
const passportConfig = require('./config/passport');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cookieParser());
app.use(cookieParser('keyboard cat'));

// var csrf = require('csurf');

// var csrfProtection = csrf();
// app.use(csrfProtection);

// Sets up a session store with Mongodb

app.use(session({
	secret : "secret",
	saveUninitialized: true,
	resave: true,
	cookie : {
        maxAge: 3600000 // see below
    }
}))

app.use(passport.initialize());
app.use(passport.session());
moment().format();


app.use(flash());

/*FRONTEND*/
var index = require('./routes/frontend/index');
var frontend_users = require('./routes/frontend/user');
var frontend_categories = require('./routes/frontend/category');
var frontend_products = require('./routes/frontend/product');
var frontend_blogs = require('./routes/frontend/blog');
var frontend_checkouts = require('./routes/frontend/checkout');



/*BACKEND*/
var admin = require('./routes/backend/admin');
var backend_users = require('./routes/backend/user');
var backend_products = require('./routes/backend/product');
var backend_categories = require('./routes/backend/category');
var backend_brands = require('./routes/backend/brand');
var backend_colors = require('./routes/backend/color');
var backend_galleries = require('./routes/backend/gallery');
var backend_specifications = require('./routes/backend/specifications')
var backend_slides = require('./routes/backend/slide')
var backend_blogs = require('./routes/backend/blog');
var backend_bills = require('./routes/backend/bill');
var backend_statisticals = require('./routes/backend/statistical');

app.use((req, res, next) => {
	res.locals.user = req.user;
	next();
});

/*FRONTEND Appuse*/

app.use('/', index);
app.use('/user', frontend_users);
app.use('/category' , frontend_categories);
app.use('/product',frontend_products);
app.use('/blog',frontend_blogs);
app.use('/checkout',frontend_checkouts);


/*BACKEND Appuse*/

app.use('/admin', admin);
app.use('/admin/user',backend_users);
app.use('/admin/product',backend_products);
app.use('/admin/category',backend_categories);
app.use('/admin/brand',backend_brands);
app.use('/admin/color',backend_colors);
app.use('/admin/gallery',backend_galleries);
app.use('/admin/specifications',backend_specifications);
app.use('/admin/slide',backend_slides);
app.use('/admin/blog',backend_blogs)
app.use('/admin/bill',backend_bills)
app.use('/admin/statistical',backend_statisticals)


app.listen(4000);
console.log('listening port 4000');


module.exports = app;
