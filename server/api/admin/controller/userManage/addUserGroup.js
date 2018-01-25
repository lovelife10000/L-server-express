'use strict';

const mongoose = require('mongoose');
const UserGroupModel = mongoose.model('UserGroup');



module.exports = {
  getParentUserGroups: function (req, res, next) {
    console.log('getParentUserGroups中',req.session)
    UserGroupModel.findOne({
      group_id: 1,
    }).then(function (info) {
      if (info.ok === 1) {
        res.status(200).json({
          code: 1,
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
