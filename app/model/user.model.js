'use strict';

const mongoose = require('mongoose');
var crypto = require('crypto');



var UserSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  nickname: String,
  email: {
    type: String,
    lowercase: true
  },
  salt: String,
  hashedPassword: String,
  facebook: {
    id: String,
    token: String,
    email: String,
    name: String
  },
  twitter: {
    id: String,
    token: String,
    displayName: String,
    username: String
  },
  google: {
    id: String,
    token: String,
    email: String,
    name: String
  },
  github: {
    id: String,
    token: String,
    email: String,
    name: String
  },
  weibo: {
    id: String,
    token: String,
    email: String,
    name: String
  },
  qq: {
    id: String,
    token: String,
    email: String,
    name: String
  },
  user_group: {
    type: String,
    default: 'user'
  },
  avatar: String,
  status: String,
  register_time:String,
  remark:String,
  phone:Number

});


UserSchema
  .virtual('password')
  .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });


UserSchema
  .virtual('userInfo')
  .get(function () {
    return {
      'username':this.username,
      'nickname': this.nickname,
      'register_time': this.register_time,
      'email': this.email,
      'avatar':'http://localhost:9001'+this.avatar
    };
  });

UserSchema
  .virtual('providerInfo')
  .get(function () {
    return {
      'qq': this.qq,
      'github': this.github,
      'weibo': this.weibo,
      'facebook': this.facebook,
      'google': this.google,
      'twitter': this.twitter
    };
  });


UserSchema
  .virtual('token')
  .get(function () {
    return {
      '_id': this._id,
      'role': this.role
    };
  });

UserSchema
  .path('nickname')
  .validate(function (value, respond) {
    var self = this;
    this.constructor.findOne({nickname: value}, function (err, user) {
      if (err) throw err;
      if (user) {
        if (self.id === user.id) return respond(true);
        return respond(false);
      }
      respond(true);
    });
  }, '这个呢称已经被使用.');


UserSchema.methods = {
  //检查用户权限
  hasRole: function (role) {
    var selfRoles = this.role;
    return (selfRoles.indexOf('admin') !== -1 || selfRoles.indexOf(role) !== -1);
  },
  //验证用户密码
  authenticate: function (plainText) {
    // console.log('this.hashedPassword是',this.hashedPassword)
    // console.log('this.encryptPassword(plainText)是',this.encryptPassword(plainText))
    return this.encryptPassword(plainText) === this.hashedPassword;
  },
  //生成盐
  makeSalt: function () {
    return crypto.randomBytes(16).toString('base64');
  },
  //生成密码
  encryptPassword: function (password) {
    if (!password || !this.salt) return '';
    var salt = new Buffer(this.salt, 'base64');
    return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha1').toString('base64');
  }
}

UserSchema.set('toObject', {virtuals: true});

var User = mongoose.model('User', UserSchema);
const Promise = require('bluebird');
Promise.promisifyAll(User);
Promise.promisifyAll(User.prototype);

module.exports = User;
