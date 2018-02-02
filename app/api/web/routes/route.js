'use strict';

var express = require('express');
var partners = require('./controller/partners');
var userManage = require('./controller/userManage');
var router = express.Router();
console.log('这里没执行？');
router.get('/partners/getPartners',partners.getPartners);
router.get('/userManage/getParentUserGroups',userManage.getParentUserGroups);

module.exports = router;