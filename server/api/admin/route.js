'use strict';

var express = require('express');
var partners = require('./controller/partners');
var addUserGroup = require('./controller/userManage/addUserGroup');
const authLocalController = require('./controller/auth/local');
const userInfoController = require('./controller/auth/local');
var router = express.Router();
console.log('路由表执行了');
router.get('/partners/getPartners',partners.getPartners);

/*
* 用户管理
* */
router.get('/userManage/getParentUserGroups',addUserGroup.getParentUserGroups);

/*
* auth认证
* */
router.post('/auth/local',authLocalController.localLogin);
router.get('/login/getCaptcha',authLocalController.getCaptcha);

/*
 * 用户信息
 * */
router.get('/userInfo',userInfoController.getUserInfo);

module.exports = router;