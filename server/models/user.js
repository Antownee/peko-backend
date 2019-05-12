var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
    userID: { type: String, unique: true },
    firstName: String,
    lastName: String,
    country: String,
    joinDate: Date,
    username: String,
<<<<<<< HEAD
    hash: String,
    role: String
=======
    password: String,
    hash: String
>>>>>>> 4ef0fce200dade858c103a083612d893080b3fb9
});

var userModel = mongoose.model('User', userSchema);
module.exports = userModel;