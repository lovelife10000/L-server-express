'use strict';

const express = require('express');
const userManageController = require('../controllers/userManage');
const docManageController = require('../controllers/docManage');
const fileManageController = require('../controllers/fileManage');
const authLocalController = require('../controllers/auth/local');
const userInfoController = require('../controllers/userInfo/userInfo');

const authMiddleware =require('../middlewares/auth.middleware');
const router = express.Router();
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();


console.log('路由表执行了');


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
* 用户管理
* */
router.post('/userManage/addUserGroup',authMiddleware.isAuthenticated(),userManageController.addUserGroup);
router.get('/userManage/getAllUserGroups',authMiddleware.isAuthenticated(),userManageController.getAllUserGroups);
router.get('/userManage/getAllUsers',authMiddleware.isAuthenticated(),userManageController.getAllUsers);
router.post('/userManage/addUser',authMiddleware.isAuthenticated(),userManageController.addUser);

/*
* 文档管理
* */
router.get('/docManage/getCategories',authMiddleware.isAuthenticated(),docManageController.getCategories);
router.post('/docManage/addCategory',authMiddleware.isAuthenticated(),docManageController.addCategory);
router.get('/docManage/getTags',authMiddleware.isAuthenticated(),docManageController.getTags);
router.post('/docManage/addTag',authMiddleware.isAuthenticated(),docManageController.addTag);
router.post('/docManage/addDoc',authMiddleware.isAuthenticated(),docManageController.addDoc);

/*
* 文件管理
* */
router.post('/fileManage/uploadAvatar',authMiddleware.isAuthenticated(),multipartMiddleware,fileManageController.uploadAvatar);




module.exports = router;