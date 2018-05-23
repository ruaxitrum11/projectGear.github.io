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


// Method
/**
 * GET /
 * Admin/product/list.
 */

 exports.revenue = async (req, res) => {
 	return res.render('backend/statistical/revenue');
 }

 