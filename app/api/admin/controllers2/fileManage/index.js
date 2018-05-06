const mongoose = require('mongoose')
const UserModel=mongoose.model('User');
const moment = require('moment')
const fs = require('fs');
const path = require('path');

module.exports = {
  uploadAvatar: function (req, res, next) {


    var base64Data = req.body.avatar.replace(/^data:image\/.*;base64,/, "");//remove head
    const base64Head = req.body.avatar.match((/^data:[A-Za-z]+\/[A-Za-z]+;base64/))[0];
    var ext = base64Head.match(/(png|gif|jpeg|jpg)/)[0];
    console.log(ext !== 'png')
    if (!['png','jpeg','jpg','gif'].includes(ext)) {
      return res.status(401).send()
    }
    const date = new Date();
    const ms = moment(date).format('YYYYMMDDHHmmss').toString();
    var target_path = path.join(__dirname, '../../../../../resources/images/') + ms + '.' + ext;
    var relativeTarget_path = '/images/' + ms + '.' + ext;
    console.log(target_path)

    fs.writeFile(target_path, base64Data, 'base64', function (err) {
      if (!err) {
        console.log('here',req.user)
        UserModel.update({
          _id: req.user._id,
        }, {
          avatar: relativeTarget_path,
        }).then(function (info) {
          return res.status(200).json({'success': true,'url':relativeTarget_path});
        });


      }
    });


  }
}