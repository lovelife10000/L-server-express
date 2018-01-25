'use strict';

const mongoose = require('mongoose');
const UserModel = mongoose.model('User');



module.exports = {
  getUserInfo: function (req, res, next) {
    console.log('req.session是2',req.session)
    UserModel.findOne({
      _id: req.session.loginedUserInfo._id,
    }).then(function (info) {
      if (info) {
        res.status(200).json({
          code: 1,
          data:info,
          msg: '登录成功'
        })
      }else {
        res.status(404).json({
          code: 0,
          msg: '登录失败'
        })
      }
    });
    // if(config.ParentUserGroups){
    //   return res.status(200).json({success:true,data:config.ParentUserGroups})
    // }else{
    //   return res.status(404).send()
    // }
  },
}
