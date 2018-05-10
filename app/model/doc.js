'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DocSchema = new Schema({
    authorId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,

    },
    content: String,
    image: {
        type: String,
    },
    tags: [{
        type: String,
        ref: 'Tag'
    }],
    click: {			//访问数
        type: Number,
        default: 1
    },
    like: {
        type: Number,
        default: 1
    },
    top: {
        type: Boolean,
        default: false
    },
    hot: {
        type: Boolean,
        default: false
    },
    type: {
        type: String,
        default: 'article'
    },
    status: {
        type: String,
        default: 0
    },
    from: {
        type: String,
        default: ''
    },
    keywords: {
        type: String,
        default: ''
    },
    category: {
        type: String,
        ref: 'Category'
    },
    description: {
        type: String,
        default: ''
    },
    abstract: {
        type: String,
        default: ''
    },
    createTime: {
        type: String,

    },

    updateTime: {
        type: String,

    },
    banner: {
        type: Boolean,
        default: false

    }
});

DocSchema
    .virtual('info')
    .get(function () {
        return {
            '_id': this._id,
            'title': this.title,
            'content': this.content,
            'image': this.image,
            'visit': this.visit,
            'commentCount': this.commentCount,
            'like': this.likeCount,
            'publishTime': this.publishTime
        };
    });

var Doc = mongoose.model('Doc', DocSchema);

// var Promise = require('bluebird');
// Promise.promisifyAll(Doc);
// Promise.promisifyAll(Doc.prototype);

module.exports = Doc;