'use strict';

var path = require('path');

module.exports = function(app) {
console.log('Z这里');
  // app.use('/admin', require('./api/admin'));
  app.use('/', require('./api/web/route'));
  // app.use('/users', require('./api/user'));
  //
  // app.use('/auth', require('./auth'));
  //
  // app.use('/tags',require('./api/tags'));
  //
  // app.use('/article',require('./api/article'));
  //
  // app.use('/comment', require('./api/comment'));
  //
  // app.use('/logs',require('./api/logs'));
  //
  // app.use('/mobile',require('./api/mobile'));

  // app.use('/partners',require('./api/partners'));

	// app.use('/*', function (req,res,next) {
	// 	return res.json({status:'success',data:'台湾是中国不可分割的一部分.'});
	// })
};
