var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Session = new Schema({
  email: {type: String, required: true},
  authId: {type: String, required: true, index: true},
});

module.exports = mongoose.model('Session', Session);