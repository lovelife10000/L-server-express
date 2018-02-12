const moment = require('moment')
const fs = require('fs');

module.exports={
  
  saveImageBase64:function (aPath,rPath,base64,cb) {

    var base64Data = base64.replace(/^data:image\/.*;base64,/, "");//remove head

    const base64Head = base64.match((/^data:[A-Za-z]+\/[A-Za-z]+;base64/))[0];

    var ext = base64Head.match(/(png|gif|jpeg|jpg)/)[0];

    if (!['png','jpeg','jpg','gif'].includes(ext)) {
      return res.status(401).send()
    }
    const date = new Date();
    const ms = moment(date).format('YYYYMMDDHHmmss').toString();

    var target_path = aPath + ms + '.' + ext;
    var relativeTarget_path = '/images/' + ms + '.' + ext;
    console.log(target_path)

    fs.writeFile(target_path, base64Data, 'base64',cb);
  }
  
};