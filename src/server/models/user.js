var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
  email: {type: String, required: true, index: true},
  name: {type: String},
  password: {type: String, required: true, bcrypt: true},
  roles: [{}]
});

User.plugin(require('mongoose-bcrypt'));

module.exports = mongoose.model('User', User);