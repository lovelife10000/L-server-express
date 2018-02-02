'use strict';

const mongoose = require('mongoose');
const UserGroupModel = mongoose.model('UserGroup');
const UserModel = mongoose.model('User');
const moment=require('moment');


module.exports = {
  getAllUserGroups: function (req, res, next) {

    UserGroupModel.find().then(function (info) {
      if (info) {
        res.status(200).json({success: true, data: info})
      } else {
        res.status(404).json({
          code: 0,
          msg: '登录失败'
        })
      }
    });
  },

  addUserGroup: function (req, res, next) {
    console.log('getParentUserGroups中', req.body)
    let name = req.body.name;
    let parentUserGroupId = req.body.parentUserGroupId;
    let userGroupStatus = req.body.userGroupStatus;

    UserGroupModel.createAsync({
      name: name,
      parent_user_group_id: parentUserGroupId,
      user_group_status: userGroupStatus
    }).then(function (result) {
      if (result) {
        return res.status(200).json({success: true});
      }

    }).catch(function (err) {
      return next(err);
    });
  },

  getAllUsers: function (req, res, next) {

    UserModel.find().then(function (info) {
      if (info) {
        res.status(200).json({success: true, data: info})
      } else {
        res.status(404).json({
          code: 0,
          msg: '登录失败'
        })
      }
    });
  },


  addUser: function (req, res, next) {
    let username = req.body.username;
    let userGroup = req.body.userGroup;
    let status = req.body.status;
    let password = req.body.password;
    let rePassword = req.body.rePassword;
    let remark = req.body.remark;
    let phone = req.body.phone;
    let nickname = req.body.nickname;
    let email = req.body.email;
    if (password !== rePassword) {
      return res.status(200).json({success: false});
    }

    UserModel.findOneAsync({
      username: username,
    }).then(function (result) {
      if (result) {
        return res.status(200).json({success: false});
      }
    }).catch(function (err) {
      return next(err);
    });
    let date = new Date();

    let ms = moment(date).format('YYYYMMDDHHmmss').toString();

    UserModel.createAsync({
      username: username,
      user_group: userGroup,
      status: status,
      remark: remark,
      phone: phone,
      nickname: nickname,
      email: email,
      register_time:ms
    }).then(function (result) {
      if (result) {
        result.set(password)
        return res.status(200).json({success: true});
      }

    }).catch(function (err) {
      return next(err);
    });
  },


}



