'use strict';

var mongoose = require('mongoose');
var passport = require('passport');
var appConfig = require('../../config/app.config');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var compose = require('composable-middleware');
var UserModel = mongoose.model('User');

/**
 * 验证token
 */
function authToken(credentialsRequired) {
  return compose()
    .use(function (req, res, next) {
      console.log('req.query是', req.query);
      if (req.query && req.query.access_token) {
        req.headers.authorization = 'Bearer ' + req.query.access_token;
      }
      next();
    })
    .use(expressJwt({
      secret: appConfig.session.secrets,
      credentialsRequired: credentialsRequired //是否抛出错误
    }))
}
/**
 * 验证用户是否登录
 */
function isAuthenticated2() {
  console.log('开始认证');
  return compose()
    .use(authToken(true))
    .use(function (err, req, res, next) {
      //expressJwt 错误处理中间件
      if (err.name === 'UnauthorizedError') {
        return res.status(401).send();
      }
      next();
    })
    .use(function (req, res, next) {
      UserModel.findById(req.user._id, function (err, user) {
        if (err) return res.status(500).send();
        if (!user) return res.status(401).send();
        req.user = user;
        next();
      });
    });
}
function isAuthenticated() {
  return function (req, res, next) {
    console.log('开始认证', req.headers.authorization);
    console.log('开始认证2', req.cookies);
    try {
      var decoded = jwt.verify(req.headers.authorization, 'L-server-express-secret');
    } catch (err) {
      return res.status(401).send({error: '非法请求'});
    }
    if (decoded) {
      console.log('req.session是666',req.cookies)
      //if(decoded._id===req.session.loginedUserInfo._id){
        req.session.logined = true;
      //}
    }else {
      return res.status(401).send({error: '非法请求'});
    }

    next();

  }


}

/**
 * 验证用户权限
 */
function hasRole(roleRequired) {
  if (!roleRequired) throw new Error('Required role needs to be set');

  return compose()
    .use(isAuthenticated())
    .use(function meetsRequirements(req, res, next) {
      if (appConfig.userRoles.indexOf(req.user.role) >= appConfig.userRoles.indexOf(roleRequired)) {
        next();
      }
      else {
        return res.status(403).send();
      }
    });
}

/**
 * 生成token
 */
function signToken(id) {
  return jwt.sign({_id: id}, appConfig.session.secrets, {expiresIn: '30m'});
}

/**
 * sns登录传递参数
 */
function snsPassport() {
  return compose()
    .use(authToken(false))
    .use(function (req, res, next) {
      req.session.passport = {
        redirectUrl: req.query.redirectUrl || '/'
      }
      if (req.user) {
        req.session.passport.userId = req.user._id;
      }
      next();
    });
}

exports.isAuthenticated = isAuthenticated;
exports.hasRole = hasRole;
exports.signToken = signToken;
exports.snsPassport = snsPassport;
