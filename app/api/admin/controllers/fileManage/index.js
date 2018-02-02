const formidable = require('formidable')
const moment = require('moment')
const fs=require('fs');
const path=require('path');

module.exports = {
  uploadAvatar: function (req, res, next) {


    var base64Data = req.body.avatar.replace(/^data:image\/.*;base64,/, "");//remove head
    console.log(req.body.avatar.match((/^data:[A-Za-z]+\/[A-Za-z]+;base64/)));
    const base64Head=req.body.avatar.match((/^data:[A-Za-z]+\/[A-Za-z]+;base64/))[0];
    var ext = base64Head.match(/(png|gif|jpeg|jpg)/);
    if(ext !=='png' || ext!=='jpeg'||ext!=='gif'||ext!=='jpg'){
      res.status(401).send()
    }
    var target_path = path.join(__dirname,'../../../../../resources/images')+'666.' + ext;
    fs.writeFile(target_path, base64Data, 'base64', function(err) {
      if (!err) {
        res.json({'msg':'success'});
      }
    });


    //   let newFileName = "";//修改后的文件名
    //
    //   const form = new formidable.IncomingForm();
    //   form.uploadDir = '../../../../../resources';//设置保存的位置
    //
    //   form.on('file', function (field, file) {//上传文件
    //
    //     const thisType = data.type;
    //     const date = new Date();
    //     const ms = moment(date).format('YYYYMMDDHHmmss').toString();
    //     let typeKey = 'img';
    //     newFileName = typeKey + ms + "." + thisType;
    //
    //     fs.rename(file.path, updatePath + newFileName, function (error) {
    //
    //     });
    //
    //
    //   });
    //
    //   form.on('error', function (err) {
    //     console.log('出现错误');
    //   });
    //
    //   form.on('end', function () {//解析完毕
    //     res.end('/upload/images/' + newFileName);
    //   });
    //
    //   form.parse(req, function (error, fields, files) {//解析request对象
    //
    //   });
  }
}