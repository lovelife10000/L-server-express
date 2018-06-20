var appConfig = require('../../../config/app')
var redis   = require('redis')


var client  = redis.createClient(appConfig.redis.port, appConfig.redis.host)


client.on('error', function(error) {
  console.log(error)
})

// redis 验证 (reids.conf未开启验证，此项可不需要)
client.auth(appConfig.redis.password)

module.exports = client