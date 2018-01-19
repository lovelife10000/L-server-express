const mongoose = require('mongoose');

var UserGroupSchema = mongoose.Schema({
  id: Number,
  group_id: Number,
  name: String,
  status: Number,
  description: String,
  power: String,
  parent: Number
});
var UserGroupModel = mongoose.model('UserGroup', UserGroupSchema);
module.exports = UserGroupModel;
