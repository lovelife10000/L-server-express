'use strict';
const mongoose = require('mongoose');
const CategoryModel = mongoose.model('Category');
const func = require('../../../util/func');
module.exports = {
    getCategories: function (req, res) {
        CategoryModel.find().then(function (result) {

            if (result) {

                const result1 = func.mapArrToGetKeys(result, ['id', 'name', 'slug', 'parentId', 'order', 'level'])
                const result2 = func.RelationList(result1, 'id', 'parentId', '0');
                const resultData = func.addKeyForArr(result2)


                return res.status(200).json({success: true, data: resultData});
            }
        }).catch(function (err) {

            return res.status(401).json({success:false,msg:err})
        });
    },

}
