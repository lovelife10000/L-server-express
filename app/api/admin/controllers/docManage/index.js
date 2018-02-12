const mongoose=require('mongoose');
const CategoryModel=mongoose.model('Category');
const TagModel=mongoose.model('Tag');
const DocModel=mongoose.model('Doc');

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
    let name=req.body.name;
    let slug=req.body.slug;

    DocModel.createAsync({
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
  
}