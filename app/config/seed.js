'use strict';

var mongoose = require('mongoose');
var User = mongoose.model('User');
var Article = mongoose.model('Article');
var TagCategory = mongoose.model('TagCategory');
var Tag = mongoose.model('Tag');
var Promise = require('bluebird');

//初始化标签,文章,用户
if (process.env.NODE_ENV === 'development') {
    User.countAsync().then(function (count) {
        if (count === 0) {
            User.removeAsync().then(function () {
                User.createAsync({
                    username: 'admin111',
                    nickname: 'admin',
                    email: 'admin@admin.com',
                    userGroup: 'admin',
                    password: 'admin111',
                    status: 1
                });
            });
        }
    });

    TagCategory.countAsync().then(function (count) {
        if (count === 0) {
            TagCategory.removeAsync().then(function () {
                return Tag.removeAsync();
            }).then(function () {
                return TagCategory.createAsync({
                    name: 'language',
                    desc: '按编程语言分类'
                }).then(function (cat) {
                    return Tag.createAsync({
                        name: 'nodejs',
                        cid: cat._id,
                        is_show: true
                    }, {
                        name: 'angular',
                        cid: cat._id,
                        is_show: true
                    }, {
                        name: 'react',
                        cid: cat._id,
                        is_show: true
                    })
                }).then(function () {
                    return TagCategory.createAsync({
                        name: 'system',
                        desc: '按操作系统分类'
                    }).then(function (cat) {
                        return Tag.createAsync({
                            name: 'linux',
                            cid: cat._id,
                            is_show: true
                        }, {
                            name: 'ios',
                            cid: cat._id,
                            is_show: true
                        }, {
                            name: 'android',
                            cid: cat._id,
                            is_show: true
                        })
                    });
                }).then(function () {
                    return TagCategory.createAsync({
                        name: 'other',
                        desc: '其它分类'
                    }).then(function (cat) {
                        return Tag.createAsync({
                            name: 'git',
                            cid: cat._id,
                            is_show: true
                        });
                    });
                }).then(function () {
                    return Tag.findAsync().then(function (tags) {
                        return tags;
                    })
                });

            }).then(function (tags) {
                return Article.removeAsync().then(function () {
                    return tags;
                });
            }).map(function (tag, index) {
                var indexOne = parseInt(index) + 1;
                var indexTwo = parseInt(index) + 2;
                Article.createAsync({
                    title: '第' + (index + indexOne) + '篇文章',
                    content: '<p>我第' + (index + indexOne) + '次爱你.</p>',
                    tags: [tag._id],
                    status: 1
                }, {
                    title: '第' + (index + indexTwo) + '篇文章',
                    content: '<p>我第' + (index + indexTwo) + '次爱你.</p>',
                    tags: [tag._id],
                    status: 1
                })
            });
        }
    })
}