var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
    userID: { type: String, unique: true },
    firstName: String,
    lastName: String,
    email: String,
    country: String,
    joinDate: Date,
    username: String,
    hash: String,
    role: String
});

var userModel = mongoose.model('User', userSchema);
module.exports = userModel;