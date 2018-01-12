'use strict';

var express = require('express');
var partners = require('./controller/partners');

var router = express.Router();

router.get('/getPartners',partners.getPartners);

module.exports = router;