const mongoose = require('mongoose')
// const Promise = require('bluebird');

const UserGroupSchema = mongoose.Schema({
  name: String,
  parentId: String,
  power: String,
  status: Boolean,
  slug:String
})
const UserGroup = mongoose.model('UserGroup', UserGroupSchema)


// Promise.promisifyAll(UserGroup);
// Promise.promisifyAll(UserGroup.prototype);
module.exports = UserGroup







