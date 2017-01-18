var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Client = new Schema({
  name: {type: String, required: true, index: true},
  groups: [{}],
  lastActive: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Client', Client);