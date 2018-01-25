'use strict';

// 设置默认环境变量
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var express = require('express');
var mongoose = require('mongoose');
var appConfig = require('./config/app.config');
var session = require('express-session');
var redisStore = require('connect-redis')(session);

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
var modelsPath = path.join(__dirname, 'model');
fs.readdirSync(modelsPath).forEach(function (file) {
  if (/(.*)\.(js$|coffee$)/.test(file)) {
    require(modelsPath + '/' + file);
  }
});
//mongoose promise 风格
mongoose.Promise = global.Promise;

// 初始化数据
if (appConfig.seedDB) {
  require('./config/seed.config');
}

var app = express();

/*
 * 设置session
 * */
app.use(session({
  secret: appConfig.session.secrets,
  store: new redisStore({//session 的存储方式，默认存放在内存中，也可以使用 redis，mongodb 等。express 生态中都有相应模块的支持。
    port: appConfig.redis.port,
    host: appConfig.redis.host,
    pass: appConfig.redis.password,
    ttl: 1800 // 过期时间
  }),
  saveUninitialized: true,
  resave: true,
  //saveUninitialized: true,
  cookie: {maxAge: 30 * 60 * 1000}
}));



require('./config/express.config')(app);
require('./routes')(app);


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
