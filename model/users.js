var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
    twitter: {id: String, token: String, username: String, displayName: String}
});

var Users = mongoose.model("Users", UserSchema);

module.exports = Users;