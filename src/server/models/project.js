var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Project = new Schema({
  dbName: {type: String, required: true, index: true},
  name: {type: String, required: true, index: true},
  description: {type: String},
  createTime: {type: Date, default: Date.now},
  clients: [{}],
  groups: [{}],
  rules: [{}]
});

module.exports = mongoose.model('Project', Project);