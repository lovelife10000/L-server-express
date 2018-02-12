const mongoose=require('mongoose');
const moment = require('moment')
const CategoryModel=mongoose.model('Category');
const TagModel=mongoose.model('Tag');
const DocModel=mongoose.model('Doc');
const fs = require('fs');
const path =require('path')


module.exports={
  getCategories:function (req,res) {
    CategoryModel.find().then(function (result) {
      if (result){
        return res.status(200).json({success:true,data:result});
      }
    }).catch(function () {
      return res.status(401).json()
    });
  },
  
  addCategory:function (req,res) {
    let name=req.body.name;
    let slug=req.body.slug;
    let parentCategoryId=req.body.parentCategoryId;
    let sort=req.body.sort;

    CategoryModel.createAsync({
      name:name,
      slug:slug,
      parent_category_id:parentCategoryId,
      sort:sort
    }).then(function (result) {
      if (result) {
        return res.status(200).json({success: true});
      }
    }).catch(function () {
      return res.status(401).json();
    });
  },

  getTags:function (req,res) {
    TagModel.find().then(function (result) {
      if (result){
        return res.status(200).json({success:true,data:result});
      }
    }).catch(function () {
      return res.status(401).json()
    });
  },

  addTag:function (req,res) {
    let name=req.body.name;
    let slug=req.body.slug;

    TagModel.createAsync({
      name:name,
      slug:slug,
    }).then(function (result) {
      if (result) {
        return res.status(200).json({success: true,msg:'添加成功'});
      }
    }).catch(function () {
      return res.status(401).json();
    });
  },


  getDocs:function (req,res) {
    DocModel.find().then(function (result) {
      if (result){
        return res.status(200).json({success:true,data:result});
      }
    }).catch(function () {
      return res.status(401).json()
    });
  },

  addDoc:function (req,res) {
    console.log('进入')
    let title=req.body.title;
    let category=req.body.category;
    let type=req.body.type;
    let status=req.body.status;
    let top=req.body.top;
    let hot=req.body.hot;
    let tags=req.body.tags;
    let from=req.body.from;
    let visitNum=req.body.visitNum;
    let likeNum=req.body.likeNum;
    let keywords=req.body.keywords;
    let description=req.body.description;
    let abstract=req.body.abstract;
    let content=req.body.content;

    let image=req.body.image;

    const date = new Date();
    const ms = moment(date).format('YYYY-MM-DD-HH:mm:ss').toString();
    let createdTime=ms;

    let publishTime=status==='published' ? ms : '';
    let updatedTime=publishTime? publishTime : '';
    let authorId=req.user._id;

    DocModel.createAsync({
      author_id:authorId,
      title,
      category,
      type,
      status,
      top,
      hot,
      tags,
      from,
      visit_num:visitNum,
      like_num:likeNum,
      keywords,
      description,
      abstract,
      content,
      created_time:createdTime,
      publish_time:publishTime,
      updated_time:updatedTime
    }).then(function (result) {
      if (result) {
        console.log('err is')

        var base64Data = image.replace(/^data:image\/.*;base64,/, "");//remove head

        const base64Head = image.match((/^data:[A-Za-z]+\/[A-Za-z]+;base64/))[0];

        var ext = base64Head.match(/(png|gif|jpeg|jpg)/)[0];

        if (!['png','jpeg','jpg','gif'].includes(ext)) {
          return res.status(401).send()
        }
        const date = new Date();
        const ms = moment(date).format('YYYYMMDDHHmmss').toString();

        var target_path = path.join(__dirname, '../../../../../resources/images/') + ms + '.' + ext;
        var relativeTarget_path = '/images/' + ms + '.' + ext;


        fs.writeFile(target_path, base64Data, 'base64',function (err) {
          if (!err) {

            DocModel.update({
              _id: result._id,
            }, {
              image: relativeTarget_path,
            }).then(function (info) {
              return res.status(200).json({success: true,msg:'添加成功'});
            }).catch(function () {

            });

          }else{
            console.log('err is' ,err)
          }
        });





      }
    }).catch(function (err) {
      console.log(err)
      return res.status(401).json();
    });
  },
  
}