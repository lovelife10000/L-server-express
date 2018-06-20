'use strict'

const  mongoose = require('mongoose')
const Schema = mongoose.Schema

const BannerSchema = new Schema({

  title: {
    type: String,

  },

  images: {
    type: String,
  },

  click: {
    type: Number,
    default: 1
  },


  type: {
    type: String,

  },

  createTime: {
    type: Date,
    default: Date.now
  },


  updateTime: {
    type: Date,
    default: Date.now
  }
})


var Banner = mongoose.model('Banner', BannerSchema)

var Promise = require('bluebird')
Promise.promisifyAll(Banner)
Promise.promisifyAll(Banner.prototype)

module.exports = Banner