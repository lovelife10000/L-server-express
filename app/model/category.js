const mongoose = require('mongoose');
const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true
    },
    parentId: String,
    order: Number,
    slug: {
        type: String,
        unique: true
    },
    level: Number,
});
const Category = mongoose.model('Category', CategorySchema);
const Promise = require('bluebird')
Promise.promisifyAll(Category);
Promise.promisifyAll(Category.prototype)

module.exports = Category;
