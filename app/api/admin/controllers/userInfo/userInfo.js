'use strict';

const mongoose = require('mongoose');
const UserModel = mongoose.model('User');



module.exports = {
  getUserInfo: function (req, res, next) {
    var userId = req.user._id;
    UserModel.findByIdAsync(userId).then(function (user) {
      return res.status(200).json(user.userInfo);
    }).catch(function (err) {
      return res.status(401).send();
    });
  },
}
