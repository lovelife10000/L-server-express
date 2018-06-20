'use strict'

const json=require('./cgi.json')

module.exports = {
  banner: function (req, res, next) {
    console.log('服务端执行了')

    return res.status(200).json({success: 1,data:json.banner})

  },
  article:function (req,res,next) {
    return res.status(200).json({success: 1,data:json.article})
  },
  recommend:function (req,res,next) {
    return res.status(200).json({success: 1,data:json.recommend})
  },
  cateBanner:function (req,res,next) {

    return res.status(200).json({success: 1,data:json.cateBanner})
  },
  cateArticle:function (req,res,next) {

    return res.status(200).json({success: 1,data:json.cateArticle})
  },
  detail:function (req,res,next) {

    return res.status(200).json({success: 1,data:json.detail})
  }

}
