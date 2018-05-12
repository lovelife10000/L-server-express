const mongoose = require('mongoose')
const UserModel = mongoose.model('User');
const moment = require('moment')
const fs = require('fs');
const path = require('path');
const appConfig=require('../../../config/app');
const fileUtil=require('../../../utils/file');
const {res200False,res200True,res200TrueField}=require('../../../utils/response')

class fileManage {
    constructor() {

    }

    async uploadAvatar(req, res, next) {

let msg=''
        var base64Data = req.body.avatar.replace(/^data:image\/.*;base64,/, "");//remove head
        const base64Head = req.body.avatar.match((/^data:[A-Za-z]+\/[A-Za-z]+;base64/))[0];
        var ext = base64Head.match(/(png|gif|jpeg|jpg)/)[0];

        if (!['png', 'jpeg', 'jpg', 'gif'].includes(ext)) {
            return res.status(401).send()
        }

        const date = new Date();
        const ms = moment(date).format('YYYYMMDDHHmmss').toString();

        var target_path =appConfig.root+'/resources/images/'+ ms + '.' + ext;

        var avatarUrl = 'images/' + ms + '.' + ext;


        try{
            await fileUtil.writeFile(target_path, base64Data, 'base64')
        }catch (e) {
            msg='存储文件出错'
            return res200False(res,msg)
        }

        try {
            const updateAvatar = await UserModel.update({_id: req.user._id,}, {avatar: avatarUrl,})

            if(updateAvatar.ok===1){

                msg='上传成功'

                return res200TrueField(res,msg,['avatar',avatarUrl])

            }else {
                msg='上传失败'
                return res200False(res,msg)
            }
        }catch (e) {
            msg='数据库操作失败'
            return res200False(res,msg)
        }









    }
}

module.exports = new fileManage()