'use strict';

const mongoose = require('mongoose');
const UserGroupModel = mongoose.model('UserGroup');
const UserModel = mongoose.model('User');
const moment = require('moment');
const validatorUtil = require('../../../utils/validator')
const {res200False, res200True, res200FalseField, res200TrueData, res200True_id} = require('../../../utils/response')

class userManage {
    constructor() {

    }

    async getAllUserGroups(req, res, next) {
        let msg = ''
        try {
            const allUserGroup = await   UserGroupModel.find({}, ' -__v');
            if (allUserGroup) {
                msg = '获取成功'
                return res200TrueData(res, msg, allUserGroup)
            } else {
                msg = '获取失败'
                return res200False(res, msg)
            }
        } catch (e) {
            msg = '查询错误'
            return res200False(res, msg)
        }


    }

    async addUserGroup(req, res, next) {

        let name = req.body.name;
        let parentId = req.body.parentId;
        let status = req.body.status;
        let slug = req.body.slug;
        let msg = ''


        //字段校验
        if (!validatorUtil.checkUserGroupName(name)) {
            msg = '用户组名称不符合规则'
            return res200False(res, msg)
        }
        if (!validatorUtil.checkUserGroupParentId(parentId)) {
            msg = '父级用户组id不符合规则'
            return res200False(res, msg)
        }

        //存在性校验
        try {
            const userGroupNameExist = await UserGroupModel.find({name});
            if (userGroupNameExist.length > 0) {
                msg = '该用户组已经存在！'
                return res200FalseField(res, msg, 'name')
            }

            const userGroupSlugExist = await UserGroupModel.find({slug});
            if (userGroupSlugExist.length > 0) {
                msg = '该别名已经存在！'
                return res200FalseField(res, msg, 'slug')
            }
        } catch (e) {
            return res200False(res, '查询出错！')
        }

        //通过校验
        try {
            const newUserGroup = await UserGroupModel.create({
                name,
                parentId,
                status,
                slug
            })

            if (newUserGroup) {

                return res200True(res, '创建成功！')
            } else {
                return res200False(res, '创建失败')
            }
        } catch (e) {
            return res200False(res, '查询出错')
        }


    }

    getAllUsers(req, res, next) {

        UserModel.find().then(function (info) {
            if (info) {
                res.status(200).json({success: true, data: info})
            } else {
                res.status(404).json({
                    code: 0,
                    msg: '登录失败'
                })
            }
        });
    }


    addUser(req, res, next) {
        let username = req.body.username;
        let userGroup = req.body.userGroup;
        let status = req.body.status;
        let password = req.body.password;
        let rePassword = req.body.rePassword;
        let remark = req.body.remark;
        let phone = req.body.phone;
        let nickname = req.body.nickname;
        let email = req.body.email;
        if (password !== rePassword) {
            return res.status(200).json({success: false});
        }

        UserModel.findOneAsync({
            username: username,
        }).then(function (result) {
            if (result) {
                return res.status(200).json({success: false});
            }
        }).catch(function (err) {
            return next(err);
        });
        let date = new Date();

        let ms = moment(date).format('YYYYMMDDHHmmss').toString();

        UserModel.createAsync({
            username: username,
            user_group: userGroup,
            status: status,
            remark: remark,
            phone: phone,
            nickname: nickname,
            email: email,
            register_time: ms
        }).then(function (result) {
            if (result) {
                result.set(password)
                return res.status(200).json({success: true});
            }

        }).catch(function (err) {
            return next(err);
        });
    }

    getUserInfo(req, res, next) {

        var userId = req.user._id;
        UserModel.findByIdAsync(userId).then(function (user) {
            return res.status(200).json(user.userInfo);
        }).catch(function (err) {
            return res.status(401).send();
        });
    }

    async changeToUse(req, res) {
        let msg = ''
        let _id = req.body._id;

        if (!validatorUtil.check_Id(_id)) {
            msg = '请求id错误！'
            return res200False(res, msg)
        }

        //通过校验
        try {
            const updateStatus = await UserModel.update({
                _id
            }, {
                status: true
            })
            if (updateStatus.ok === 1) {
                msg = '修改成功'
                return res200True_id(res, msg, _id)

            } else {
                msg = '修改失败'
                return res200False(res, msg)
            }


        } catch (err) {
            msg = '查询出错'
            return res200False(res, msg)

        }


    }

    async changeToNotUse(req, res) {
        let msg = ''
        let _id = req.body._id;

        if (!validatorUtil.check_Id(_id)) {
            msg = '请求id错误！'
            return res200False(res, msg)
        }

        //通过校验
        try {
            const updateStatus = await UserModel.update({
                _id
            }, {
                status: false
            })
            if (updateStatus.ok === 1) {
                msg = '修改成功'
                return res200True_id(res, msg, _id)
            } else {
                msg = '修改失败'
                return res200False(res, msg)
            }


        } catch (err) {
            msg = '查询出错'
            return res200False(res, msg)
        }


    }


}

module.exports = new userManage()



