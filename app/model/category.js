const mongoose = require('mongoose')
const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    index: true,
    unique: true
  },
  parentId: String,
  order: Number,
  slug: {
    type: String,
    index: true,
    unique: true
  },
  level: Number,
})
const Category = mongoose.model('Category', CategorySchema)
const Promise = require('bluebird')
Promise.promisifyAll(Category)
Promise.promisifyAll(Category.prototype)

module.exports = Category
