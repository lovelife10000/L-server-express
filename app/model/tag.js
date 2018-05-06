'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TagSchema = new Schema({
	name:{						//标签名称
		type:String,
		unique: true
	},	
	slug:{
		type:String,
    unique: true
	},
});

var Tag = mongoose.model('Tag',TagSchema);

var Promise = require('bluebird');
Promise.promisifyAll(Tag);
Promise.promisifyAll(Tag.prototype);

module.exports = Tag;