'use strict'

const mongoose = require('mongoose')
const UserModel = mongoose.model('User')
const ccap = require('ccap')()
const redisUtil = require('../../../utils/api/redis/redis.util')
const authUtil = require('../../../utils/api/auth.util')
const appConfig = require('../../../config/app')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const loggerUtil = require('../../../utils/logs')

class auth {
  constructor() {

  }

  localLogin2(req, res, next) {
    console.log('控制器执行了')
    console.log('session is 2', req.session)
    let errorMsg
    if (!req.body.captcha) {
      errorMsg = '验证码不能为空.'
    } else if (req.session.captcha !== req.body.captcha.toUpperCase()) {
      errorMsg = '验证码错误.'
    } else if (req.body.username === '' || req.body.password === '') {
      errorMsg = '用户名和密码不能为空.'
    }
    if (errorMsg) {
      return res.status(200).send({errorMsg: errorMsg})
    } else {

      const username = req.body.username
      const password = req.body.password

      UserModel.findOne({
        username: username
      }).then(function (info) {
        if (!info) {
          return res.status(200).send({
            errorMsg: '用户名错误'
          })
        }
        if (!info.authenticate(password)) {
          return res.status(200).send({
            errorMsg: '密码不正确'
          })
        } else {
          req.session.logined = true

          req.session.loginedUserInfo = info
          req.user = info
          console.log('密码不正确2', req.session)

          //把session保存到redis中
          redisUtil.set(appConfig.session.secrets, req.session, 1000 * 60 * 60 * 24)
          console.log('密码不正确3', redisUtil.get(appConfig.session.secrets, function (data) {
            console.log('密码不正确4', data)
          }))
          //生成token
          let token = authUtil.signToken(info._id)

          return res.status(200).json({
            token: token
          })

        }

      })

    }
  }

  localLogin(req, res, next) {
    console.log('控制器执行了')
    passport.use(new LocalStrategy({
      usernameField: 'username',
      passwordField: 'password' // this is the virtual field on the model
    },
    function (username, password, done) {
      console.log('控制器执行了10')
      UserModel.findOne({
        username: username.toLowerCase()
      }, function (err, user) {

        console.log('控制器执行了11')
        if (err) return done(err)
        if (!user) {
          loggerUtil.error('登录用户名错误', {'username': username})
          return done(null, false, {errorMsg: '用户名或密码错误.'})
        }
        if (!user.authenticate(password)) {
          loggerUtil.error('登录密码错误', {'username': username})
          return done(null, false, {errorMsg: '用户名或密码错误.'})
        }

        if (user.status === 2) {
          loggerUtil.error('被阻止登录', {'username': username})
          return done(null, false, {errorMsg: '用户被阻止登录.'})
        }
        if (user.status === 0) {
          loggerUtil.error('未验证用户登录', {'username': username})
          return done(null, false, {errorMsg: '用户未验证.'})
        }
        return done(null, user)
      })
    }
    ))

    console.log('控制器执行了2')
    //测试环境不用验证码
    if (process.env.NODE_ENV !== 'test') {
      console.log('控制器执行了3')
      console.log(req.session.captcha + '666')
      console.log(req.body.captcha.toUpperCase() + '777')
      let errorMsg
      if (!req.body.captcha) {
        errorMsg = '验证码不能为空.'

      } else if (req.session.captcha !== req.body.captcha.toUpperCase()) {
        errorMsg = '验证码错误.'
      } else if (req.body.username === '' || req.body.password === '') {
        errorMsg = '用户名和密码不能为空.'
      }
      if (errorMsg) {
        return res.status(400).send({errorMsg: errorMsg})
      }


      console.log('控制器执行了4')
      passport.authenticate('local', function (err, user, info) {
        console.log('控制器执行了5')
        if (err) {
          return res.status(401).send()
        }
        if (info) {
          return res.status(403).send(info)
        }

        const token = authUtil.signToken(user._id)
        // res.cookie('token', token, { maxAge: 60000*30, httpOnly: true });
        return res.json({token: token})
      })(req, res, next)
    }
    console.log('控制器执行了6')

  }

  getCaptcha(req, res, next) {
    var ary = ccap.get()
    var txt = ary[0]
    var buf = ary[1]
    req.session.captcha = txt
    console.log('session is ', req.session)
    return res.status(200).send(buf)
  }
}

module.exports = new auth()

