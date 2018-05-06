const mongoose = require('mongoose');
const moment = require('moment')
const CategoryModel = mongoose.model('Category');
const TagModel = mongoose.model('Tag');
const DocModel = mongoose.model('Doc');
const fs = require('fs');
const path = require('path')
const func = require('../../../../util/func');
var validator = require('validator');


module.exports = {
    getCategories: function (req, res) {
        CategoryModel.find().then(function (result) {

            if (result) {

                const result1 = func.mapArrToGetKeys(result, ['id', 'name', 'slug', 'parentId', 'order', 'level'])
                const result2 = func.RelationList(result1, 'id', 'parentId', '0');
                const resultData = func.addKeyForArr(result2)


                return res.status(200).json({success: true, data: resultData});
            }
        })
            .catch(function () {
                return res.status(401).json()
            });
    },

    addCategory: function (req, res) {
        let name = req.body.name;
        let slug = req.body.slug;
        let parentId = req.body.parentId;
        let order = req.body.order;

        CategoryModel.createAsync({
            name: name,
            slug: slug,
            parentId: parentId,
            order: order
        }).then(function (result) {
            if (result) {
                return res.status(200).json({success: true, msg: '添加成功'});
            }
        }).catch(function () {
            return res.status(401).json();
        });
    },

    editCategory: function (req, res) {
        let name = req.body.name;
        let slug = req.body.slug;
        let parentId = req.body.parentId;
        let order = req.body.order;
        let id = req.body.id;

        CategoryModel.updateAsync({
            _id: id
        }, {
            name: name,
            slug: slug,
            parentId: parentId,
            order: order
        }).then(function (result) {
            if (result) {
                return res.status(200).json({success: true, msg: '更新成功'});
            }
        }).catch(function () {
            return res.status(401).json();
        });
    },

    removeCategory: function (req, res) {
        let id = req.body.id;

        CategoryModel.removeAsync({
            _id: id
        }).then(function (result) {
            if (result) {
                return res.status(200).json({success: true, msg: '删除成功'});
            }
        }).catch(function () {
            return res.status(401).json();
        });
    },

    getTags: function (req, res) {
        TagModel.find().then(function (result) {
            if (result) {
                return res.status(200).json({success: true, data: result});
            }
        }).catch(function () {
            return res.status(401).json()
        });
    },

    addTag: function (req, res) {
        let name = req.body.name;
        let slug = req.body.slug;

        TagModel.createAsync({
            name: name,
            slug: slug,
        }).then(function (result) {
            if (result) {
                return res.status(200).json({success: true, msg: '添加成功'});
            }
        }).catch(function () {
            return res.status(401).json();
        });
    },


    getDocs: function (req, res) {
        const current=req.body.current;
        validator.isEmail(current)
        DocModel.find({},'abstract click createTime hot like title top type updateTime -_id')
            .populate({ path: 'category', select: 'name -_id' })   //上述结果集合中的dep字段用departments表中的name字段填充
            .populate({ path: 'authorId', select: ' username -_id' })
            .then(function (result) {
            if (result) {
                return res.status(200).json({success: true, data: result});
            }
        }).catch(function () {
            return res.status(401).json()
        });
    },

    addDoc: function (req, res) {

        let title = req.body.title;
        let category = req.body.category;
        let type = req.body.type;
        let status = req.body.status;
        let top = req.body.top;
        let hot = req.body.hot;
        let tags = req.body.tags;
        let from = req.body.from;
        let click = req.body.click;
        let like = req.body.like;
        let keywords = req.body.keywords;
        let description = req.body.description;
        let abstract = req.body.abstract;
        let content = req.body.content;

        let image = req.body.image;

        const date = new Date();
        const ms = moment(date).format('YYYY-MM-DD-HH:mm:ss').toString();
        let createTime = ms;

        let publishTime = status === 'published' ? ms : '';
        let updateTime = publishTime ? publishTime : '';
        let authorId = req.user._id;

        DocModel.createAsync({
            authorId,
            title,
            category,
            type,
            status,
            top,
            hot,
            tags,
            from,
            click,
            like,
            keywords,
            description,
            abstract,
            content,
            createTime,
            updateTime
        }).then(function (result) {
            if (result) {
                debugger

                var base64Data = image.replace(/^data:image\/.*;base64,/, "");//remove head

                const base64Head = image.match((/^data:[A-Za-z]+\/[A-Za-z]+;base64/))[0];

                var ext = base64Head.match(/(png|gif|jpeg|jpg)/)[0];

                if (!['png', 'jpeg', 'jpg', 'gif'].includes(ext)) {
                    return res.status(401).send()
                }
                const date = new Date();
                const ms = moment(date).format('YYYYMMDDHHmmss').toString();

                var target_path = path.join(__dirname, '../../../../../resources/images/') + ms + '.' + ext;
                var relativeTarget_path = '/images/' + ms + '.' + ext;


                fs.writeFile(target_path, base64Data, 'base64', function (err) {
                    if (!err) {

                        DocModel.update({
                            _id: result._id,
                        }, {
                            image: relativeTarget_path,
                        }).then(function (info) {
                            return res.status(200).json({success: true, msg: '添加成功'});
                        }).catch(function () {

                        });

                    } else {
                        console.log('err is', err)
                    }
                });


            }
        }).catch(function (err) {
            console.log(err)
            return res.status(401).json();
        });
    },

    searchDocs: function (req, res) {

        let list = req.body.list;
        let obj = {}
        for (let i of list) {
            if (req.body[i]) {
                if (i === 'createTime') {

                    obj[i] = {
                        $gte: req.body[i][0],
                        $lt: req.body[i][1]
                    }
                }else {
                    obj[i] = req.body[i]
                }

            }
        }
        console.log(obj);



        DocModel.find(obj,'title createTime updateTime type hot top like click')
            .populate({ path: 'category', select: 'name -_id' })   //上述结果集合中的dep字段用departments表中的name字段填充
            .populate({ path: 'authorId', select: ' username -_id' })

            .then(function (result) {

            if (result) {




                return res.status(200).json({success: true, data: result});
            }
        })
            .catch(function () {
                return res.status(401).json()
            });
    },

}