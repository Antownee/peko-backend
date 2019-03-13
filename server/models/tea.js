var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var teaSchema = new Schema({
    teaID: { type: String, unique: true },
    teaName: String,
    blend: Boolean
    //more details  
});


var teaModel = mongoose.model('Tea', teaSchema);
module.exports = teaModel;