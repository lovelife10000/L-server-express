'use strict'

var express = require('express')
var banner = require('../controllers/banner')
var categoriesController = require('../controllers/category')

var router = express.Router()

router.get('/banner',banner.banner)
router.get('/article',banner.article)
router.get('/recommend',banner.recommend)
router.get('/category/cateBanner',banner.cateBanner)
router.get('/category/cateArticle',banner.cateArticle)
router.get('/detail',banner.detail)
router.get('/getCategories',categoriesController.getCategories)

module.exports = router