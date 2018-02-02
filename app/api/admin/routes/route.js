'use strict';

const express = require('express');
const userManageController = require('../controllers/userManage');
const fileManageController = require('../controllers/fileManage');
const authLocalController = require('../controllers/auth/local');
const userInfoController = require('../controllers/userInfo/userInfo');
const authMiddleware =require('../middlewares/auth.middleware');
const router = express.Router();
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();


console.log('路由表执行了');


/*
* 用户管理
* */
router.post('/userManage/addUserGroup',authMiddleware.isAuthenticated(),userManageController.addUserGroup);
router.get('/userManage/getAllUserGroups',authMiddleware.isAuthenticated(),userManageController.getAllUserGroups);
router.get('/userManage/getAllUsers',authMiddleware.isAuthenticated(),userManageController.getAllUsers);
router.post('/userManage/addUser',authMiddleware.isAuthenticated(),userManageController.addUser);

/*
* auth认证
* */
router.post('/auth/local',authLocalController.localLogin);
router.get('/login/getCaptcha',authLocalController.getCaptcha);

/*
 * 用户信息
 * */
router.get('/userInfo',authMiddleware.isAuthenticated(),userInfoController.getUserInfo);


/*
* 文件管理
* */
router.post('/fileManage/uploadAvatar',authMiddleware.isAuthenticated(),multipartMiddleware,fileManageController.uploadAvatar);




module.exports = router;