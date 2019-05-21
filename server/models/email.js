var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var emailSchema = new Schema({
    email: String,
});


var emailModel = mongoose.model('Email', emailSchema);
module.exports = emailModel;