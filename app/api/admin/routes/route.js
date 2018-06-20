'use strict'

const express = require('express')

const { docManage, userManage, fileManage, auth } = require('../controllers')



// const validator = require('../validator')
const authMiddleware = require('../middlewares/auth.middleware')
const router = express.Router()
const multipart = require('connect-multiparty')
const multipartMiddleware = multipart()



/*
* auth认证
* */
router.post('/auth/local', auth.localLogin2)
router.get('/login/getCaptcha', auth.getCaptcha)

/*
 * 用户信息
 * */
router.get('/userInfo', authMiddleware.isAuthenticated(), userManage.getUserInfo)


/*
* 用户管理
* */
router.post('/userManage/addUserGroup', authMiddleware.isAuthenticated(), userManage.addUserGroup)
router.get('/userManage/getAllUserGroups', authMiddleware.isAuthenticated(), userManage.getAllUserGroups)
router.get('/userManage/getAllUsers', authMiddleware.isAuthenticated(), userManage.getAllUsers)
router.post('/userManage/addUser', authMiddleware.isAuthenticated(), userManage.addUser)
router.post('/userManage/changeToUse', authMiddleware.isAuthenticated(), userManage.changeToUse)
router.post('/userManage/changeToNotUse', authMiddleware.isAuthenticated(), userManage.changeToNotUse)

/*
* 文档管理
* */
router.get('/docManage/getCategories', authMiddleware.isAuthenticated(), docManage.getCategories)
router.post('/docManage/addCategory', authMiddleware.isAuthenticated(), docManage.addCategory)
router.post('/docManage/editCategory', authMiddleware.isAuthenticated(), docManage.editCategory)
router.post('/docManage/removeCategory', authMiddleware.isAuthenticated(), docManage.removeCategory)
router.get('/docManage/getTags', authMiddleware.isAuthenticated(), docManage.getTags)
router.post('/docManage/addTag', authMiddleware.isAuthenticated(), docManage.addTag)
router.post('/docManage/addDoc', authMiddleware.isAuthenticated(), docManage.addDoc)
router.post('/docManage/getDocs', authMiddleware.isAuthenticated(), docManage.getDocs)
router.post('/docManage/searchDocs', authMiddleware.isAuthenticated(), docManage.searchDocs)
router.post('/docManage/changeToHot', authMiddleware.isAuthenticated(), docManage.changeToHot)
router.post('/docManage/changeToNotHot', authMiddleware.isAuthenticated(), docManage.changeToNotHot)
router.post('/docManage/changeToTop', authMiddleware.isAuthenticated(), docManage.changeToTop)
router.post('/docManage/changeToNotTop', authMiddleware.isAuthenticated(), docManage.changeToNotTop)
/*
* 文件管理
* */
router.post('/fileManage/uploadAvatar', authMiddleware.isAuthenticated(), multipartMiddleware, fileManage.uploadAvatar)


module.exports = router