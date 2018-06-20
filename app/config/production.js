'use strict'


var MONGO_ADDR = process.env.MONGO_PORT_27017_TCP_ADDR || 'localhost'

module.exports = {
  domain:'http://www.lijun1991.com',
  port: process.env.PORT || 8800,

  mongo: {
    uri: 'mongodb://' +  MONGO_ADDR + '/jackblog'
  },

  redis: {
    db: 1,
    dropBufferSupport: true
  },

  session:{
    cookie:  {domain:'.lijun1991.com',maxAge: 60000*5}
  }
}
