var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var teaSchema = new Schema({
    teaID: { type: String, unique: true },
    teaName: String,
    teaDescription: String
});


var teaModel = mongoose.model('Tea', teaSchema);
module.exports = teaModel;