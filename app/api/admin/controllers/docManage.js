const mongoose = require('mongoose');
const DocModel = mongoose.model('Doc');

const CategoryModel = mongoose.model('Category');
const validator = require('validator');
const validatorUtil = require('../../../utils/validator')
const {res200False, res200True,res200FalseField} = require('../../../utils/response')

const moment = require('moment')

const TagModel = mongoose.model('Tag');

const fs = require('fs');
const path = require('path')
const func = require('../../../utils/func');


class docManage {
    constructor() {
        // super()
    }


    getCategories(req, res) {
        CategoryModel.find().then(function (result) {

            if (result) {


                const result1 = func.mapArrToGetKeys(result, ['id', 'name', 'slug', 'parentId', 'order', 'level'])

                const result2 = func.RelationList(result1, 'id', 'parentId', '0');
                // const resultData = func.addKeyForArr(result2)


                return res.status(200).json({success: true, data: result2,msg:'获取成功'});
            }
        })
            .catch(function () {
                return res.status(401).json()
            });
    }

    async addCategory(req, res) {


        let name = req.body.name;
        let slug = req.body.slug;
        let parentId = req.body.parentId;
        let order = req.body.order;
        let msg = ''
        try {
            if (!validatorUtil.checkCategoryName(name)) {
                msg = '分类名称错误！'
                throw ('err')
            }
            if (!validatorUtil.checkCategorySlug(slug)) {
                msg = '分类别名错误！'
                throw ('err')
            }
            if (!validatorUtil.checkCategoryOrder(order)) {
                msg = '排序值错误！'
                throw ('err')
            }
            if (!validatorUtil.checkCategoryParentId(parentId)) {
                msg = '父级id错误！'
                throw ('err')
            }
            //存在性校验
            try {
                const categoryNameExist = await CategoryModel.find({name});

                if (categoryNameExist.length>0) {

                    msg = '分类名称已经存在！'
                    return res200FalseField(res, msg,'name')


                }
                const categorySlugExist = await CategoryModel.find({slug});
                if (categorySlugExist.length>0) {
                    msg = '分类别名已经存在！'
                    return res200FalseField(res, msg,'slug')
                }
            } catch (err) {
                return res200False(res, '查询出错')
            }


            //通过校验
            try {

                const createCate = await CategoryModel.create({
                    name: name,
                    slug: slug,
                    parentId: parentId,
                    order: order
                });

                if (createCate) {
                    return res200True(res, '添加成功')

                } else {
                    return res200False(res, '添加失败')

                }
            } catch (err) {
                return res200False(res, '查询出错')
            }

        } catch (err) {
            return res200False(res, msg)

        }

    }

    editCategory(req, res) {
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
    }

    removeCategory(req, res) {
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
    }

    getTags(req, res) {
        TagModel.find().then(function (result) {
            if (result) {
                return res.status(200).json({success: true, data: result});
            }
        }).catch(function () {
            return res.status(401).json()
        });
    }

    addTag(req, res) {
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
    }


    async getDocs(req, res) {
        let msg = ''


        const current = req.body.current;
        const pageSize = req.body.pageSize;


        try {

            if (!validatorUtil.checkCurrentPage(current)) {
                msg = 'current错误!'
                throw ('err')
            }
            if (!validatorUtil.checkPageSize(pageSize)) {
                msg = 'pageSize错误!'
                throw ('err')
            }

            //通过验证
            try {
                let limit = Number(pageSize);
                let currentPage = current;
                let skip = (currentPage - 1) * limit;
                const total = await DocModel.count()

                const docs = await DocModel.find({}, 'abstract click createTime hot like title top type updateTime ')
                    .limit(limit).skip(skip).sort({date: -1})
                    .populate({path: 'category', select: 'name -_id'})   //上述结果集合中的dep字段用departments表中的name字段填充
                    .populate({path: 'authorId', select: ' username -_id'})
                    .exec();

                return res.status(200).json({
                    success: true,
                    data: {total, docs}
                })


            } catch (err) {
                return res.status(401).json({
                    success: false,
                    msg: '查询遇到错误！'
                })
            }


        } catch (err) {

            return res.status(401).json({
                success: false,
                msg
            })

        }


    }

    addDoc(req, res) {

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
    }

    searchDocs(req, res) {

        let list = req.body.list;
        let obj = {}
        for (let i of list) {
            if (req.body[i]) {
                if (i === 'createTime') {

                    obj[i] = {
                        $gte: req.body[i][0],
                        $lt: req.body[i][1]
                    }
                } else {
                    obj[i] = req.body[i]
                }

            }
        }
        console.log(obj);


        DocModel.find(obj, 'title createTime updateTime type hot top like click')
            .populate({path: 'category', select: 'name -_id'})   //上述结果集合中的dep字段用departments表中的name字段填充
            .populate({path: 'authorId', select: ' username -_id'})

            .then(function (result) {

                if (result) {


                    return res.status(200).json({success: true, data: result});
                }
            })
            .catch(function () {
                return res.status(401).json()
            });
    }

    async changeToHot(req, res) {
        let msg = ''
        let _id = req.body._id;
        try {
            if (!validatorUtil.check_Id(_id)) {
                msg = '请求id错误！'
                throw 'err'
            }

            //通过校验
            try {
                const updateHot = await DocModel.update({
                    _id
                }, {
                    hot: true
                })
                if (updateHot.ok === 1) {
                    return res.status(200).json({success: true, msg: '修改成功', _id})
                } else {
                    return res.status(401).json({success: false, msg: '修改失败'})
                }


            } catch (err) {
                return res.status(401).json({success: false, msg: '查询过程出错'})
            }

        } catch (err) {
            return res.status(401).json({success: false, msg})
        }


    }

    async changeToNotHot(req, res) {
        let msg = ''
        let _id = req.body._id;
        try {
            if (!validatorUtil.check_Id(_id)) {
                msg = '请求id错误！'
                throw 'err'
            }

            //通过校验
            try {
                const updateHot = await DocModel.update({
                    _id
                }, {
                    hot: false
                })
                if (updateHot.ok === 1) {
                    return res.status(200).json({success: true, msg: '修改成功', _id})
                } else {
                    return res.status(401).json({success: false, msg: '修改失败'})
                }


            } catch (err) {
                return res.status(401).json({success: false, msg: '查询过程出错'})
            }

        } catch (err) {
            return res.status(401).json({success: false, msg})
        }


    }

    async changeToTop(req, res) {
        let msg = ''
        let _id = req.body._id;
        try {
            if (!validatorUtil.check_Id(_id)) {
                msg = '请求id错误！'
                throw 'err'
            }

            //通过校验
            try {
                const updateHot = await DocModel.update({
                    _id
                }, {
                    top: true
                })
                if (updateHot.ok === 1) {
                    return res.status(200).json({success: true, msg: '修改成功', _id})
                } else {
                    return res.status(401).json({success: false, msg: '修改失败'})
                }


            } catch (err) {
                return res.status(401).json({success: false, msg: '查询过程出错'})
            }

        } catch (err) {
            return res.status(401).json({success: false, msg})
        }


    }

    async changeToNotTop(req, res) {
        let msg = ''
        let _id = req.body._id;
        try {
            if (!validatorUtil.check_Id(_id)) {
                msg = '请求id错误！'
                throw 'err'
            }

            //通过校验
            try {
                const updateHot = await DocModel.update({
                    _id
                }, {
                    top: false
                })
                if (updateHot.ok === 1) {
                    return res.status(200).json({success: true, msg: '修改成功', _id})
                } else {
                    return res.status(401).json({success: false, msg: '修改失败'})
                }


            } catch (err) {
                return res.status(401).json({success: false, msg: '查询过程出错'})
            }

        } catch (err) {
            return res.status(401).json({success: false, msg})
        }


    }
}

module.exports = new docManage()