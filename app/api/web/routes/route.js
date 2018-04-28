'use strict';

var express = require('express');
var banner = require('../controllers/banner');

var router = express.Router();
console.log('载入web路由');
router.get('/banner',banner.banner);
router.get('/article',banner.article)
router.get('/recommend',banner.recommend)
router.get('/category/cateBanner',banner.cateBanner)
router.get('/category/cateArticle',banner.cateArticle)
router.get('/detail',banner.detail)

module.exports = router;