const mongoose =require('mongoose');
const CategorySchema=new mongoose.Schema({
  name:String,
  parentId:String,
    order:Number,
  slug:String
});
const Category=mongoose.model('Category',CategorySchema);
const Promise =require('bluebird')
Promise.promisifyAll(Category);
Promise.promisifyAll(Category.prototype)

module.exports=Category;
