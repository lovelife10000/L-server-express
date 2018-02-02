const mongoose = require('mongoose');
const Promise = require('bluebird');

const UserGroupSchema = mongoose.Schema({
  name: String,
  group_id: Number,
  parent_user_group_id: String,
  power: String,
  user_group_status: Boolean
});
const UserGroupModel = mongoose.model('UserGroup', UserGroupSchema);


Promise.promisifyAll(UserGroupModel);
Promise.promisifyAll(UserGroupModel.prototype);
module.exports = UserGroupModel;







