'use strict';

var express = require('express');
var partners = require('./controller/partners');
var router = express.Router();
console.log('这里没执行？');
router.get('/partners/getPartners',partners.getPartners);

module.exports = router;