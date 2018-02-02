'use strict';
var config = require('../../../config/env');


// module.exports = {
//   getPartners: function (req, res, next) {
//     console.log('服务端执行了')
//     if (config.Partners) {
//       console.log('服务端执行了2')
//       return res.status(200).json({success: true, data: config.Partners})
//     } else {
//       return res.status(404).send()
//     }
//   },
// };

exports.getPartners = function(req,res,next){
  console.log('服务端执行了')
  if(config.Partners){
    return res.status(200).json({success:true,data:config.Partners})
  }else{
    return res.status(404).send()
  }
};
