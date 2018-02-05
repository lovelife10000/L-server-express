'use strict';

// 设置默认环境变量
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var express = require('express');
var mongoose = require('mongoose');
var appConfig = require('../config/app.config');
var session = require('express-session');
var path = require('path');
var fs = require('fs');
var errorHandler = require('errorhandler');
console.log('开始执行app')
// 连接数据库.
mongoose.connect(appConfig.mongo.uri, appConfig.mongo.options, function (err) {
  if (err) {
    console.log('数据库连接失败');
  } else {
    console.log('数据库连接成功');
  }
});
var modelsPath = path.join(__dirname,'..', 'model');
fs.readdirSync(modelsPath).forEach(function (file) {
  if (/(.*)\.(js$|coffee$)/.test(file)) {
    require(modelsPath + '/' + file);
  }
});



//mongoose promise 风格
mongoose.Promise = global.Promise;

// 初始化数据
if (appConfig.seedDB) {
  require('../config/seed.config');
}

var app = express();
app.use(express.static(path.join(__dirname, '..', '../resources')))




require('../config/express.config')(app);
require('../routes/routes')(app);


if ('development' === appConfig.env) {
  app.use(errorHandler());
} else {
  app.use(function (err, req, res, next) {
    return res.status(500).send();
  });
}

// Start server

app.listen(appConfig.port, function () {
  console.log('Express server listening on %d, in %s mode', appConfig.port, app.get('env'));
});

exports = module.exports = app;
