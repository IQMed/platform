var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Account = new Schema({
  email: {type: String, required: true, index: true},
  name: {type: String},
  password: {type: String, required: true, bcrypt: true}
});

Account.plugin(require('mongoose-bcrypt'));

module.exports = mongoose.model('Account', Account);