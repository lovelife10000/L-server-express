'use strict';

const mongoose = require('mongoose');
const UserModel = mongoose.model('User');
const ccap = require('ccap')();
const redisUtil = require('../../../../../util/api/redis/redis.util');
const authUtil = require('../../../../../util/api/auth.util');
const appConfig = require('../../../../../config/app.config');


module.exports = {
  localLogin: function (req, res, next) {
    console.log('控制器执行了')
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

      const username = req.body.username;
      const password = req.body.password;

      UserModel.findOne({
        username: username
      }).then(function (info) {
        if (!info) {
          return res.status(200).send({
            errorMsg: '用户名错误'
          });
        }
        if (!info.authenticate(password)) {
          return res.status(200).send({
            errorMsg: '密码不正确'
          });
        } else {
          req.session.logined = true;

          req.session.loginedUserInfo = info;
          console.log('密码不正确2',req.session);

          //把session保存到redis中
          redisUtil.set(appConfig.session.secrets,req.session, 1000 * 60 * 60 * 24);
          console.log('密码不正确3',redisUtil.get(appConfig.session.secrets,function (data) {
            console.log('密码不正确4',data);
          }));
          //生成token
          let token = authUtil.signToken(info._id);

          return res.status(200).json({
            token: token
          });

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

