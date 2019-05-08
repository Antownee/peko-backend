var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
    userID: { type: String, unique: true },
    firstName: String, 
    lastName: String, 
    country: String,
    joinDate: Date,
    username: String,
    password: String,
    hash: String
});

var userModel = mongoose.model('User', userSchema);
module.exports = userModel;