'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DocSchema = new Schema({
	author_id:{
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	title:{
		type:String,
		unique: true
	},
	content:String,
	images:{
		type:String,
	},
	tags:[{
	  type: Schema.Types.ObjectId,
	  ref: 'Tag'
	}],
	visit_num:{			//访问数
		type:Number,
		default:1
	},
	like_num:{
		type:Number,
		default:1
	},
	top:{
		type:Boolean,
		default:false
	},
  hot:{
    type:Boolean,
    default:false
  },
  type:{
    type:String,
    default:'article'
  },
	status:{				//0:草稿 1:发布
		type:Number,
		default:0
	},
	created_time: {
		type: Date,
		default: Date.now
	},
	publish_time: {
		type: Date,
		default: Date.now
	},
  from: {
    type: String,
    default:''
  },
  keywords: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default:''
  },
  abstract: {
    type: String,
    default:''
  },
  updated_time: {
    type: Date,
    default: Date.now
  }
});

DocSchema
  .virtual('info')
  .get(function() {
    return {
    	'_id': this._id,
      'title': this.title,
      'content': this.content,
      'images': this.images,
      'visit_count': this.visit_count,
      'comment_count':this.comment_count,
      'like_count':this.like_count,
      'publish_time': this.publish_time
    };
  });

var Doc = mongoose.model('Doc',DocSchema);

var Promise = require('bluebird');
Promise.promisifyAll(Doc);
Promise.promisifyAll(Doc.prototype);

module.exports = Doc;