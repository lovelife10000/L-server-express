'use strict';

const config = require('../../../config/env');
const UserGroupModel = require('../../../model/userGroup.model');
const UserModel = require('../../../model/user.model');
const ccap = require('ccap')();
const redisUtil = require('../../../util/redis.util');
const appConfig = require('../../../config/app.config');


module.exports = {
  login: function (req, res, next) {
    let errorMsg;
    if (!req.body.captcha) {
      errorMsg = "验证码不能为空.";
    } else if (req.session.captcha !== req.body.captcha.toUpperCase()) {
      errorMsg = "验证码错误.";
    } else if (req.body.username === '' || req.body.password === '') {
      errorMsg = "用户名和密码不能为空.";
    }
    if (errorMsg) {
      return res.status(200).send({errorMsg: errorMsg});
    } else {
      var username = req.body.username;
      var password = req.body.password;

      UserModel.findOne({
        username: username,
        password: password
      }).then(function (info) {

        if (!info) {
          res.status(200).send({
            errorMsg: '用户名不存在'
          });
        } else {
          if (info.password !== password) {
            res.status(200).send({
              errorMsg: '用户名或密码不正确'
            });
          } else {
            req.session.logined = true;
            req.session.loginedUserInfo = info;


            //把session保存到redis中
            redisUtil.set(appConfig.sessionSecret + '_siteTemplate', 1, 1000 * 60 * 60 * 24);
            //生成token
            let token = auth.signToken(user._id);

            return res.status(200).json({
              token: token
            });

          }
        }
      });

    }
  },
  getCaptcha: function (req, res, next) {
    var ary = ccap.get();
    var txt = ary[0];
    var buf = ary[1];
    req.session.captcha = txt;
    return res.status(200).send(buf);
  },
};
